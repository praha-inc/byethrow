import { useDark } from '@rspress/core/runtime';
import { HomeBackground as BaseHomeBackground } from '@rspress/core/theme-original';
import { useEffect, useRef } from 'react';

import styles from './home-background.module.css';

import type { Scene } from './scene';
import type { FC } from 'react';

/**
 * Share of the page scrolled (0 = top, 1 = bottom) over which the success rate rises to 100%.
 * The scene stays in its failure state until PROGRESS_START.
 */
const PROGRESS_START = 0.35;
const PROGRESS_END = 0.65;

const clamp01 = (value: number): number => Math.min(Math.max(value, 0), 1);

const measureProgress = (): number => {
  const scrollable = document.documentElement.scrollHeight - globalThis.innerHeight;
  const ratio = scrollable > 0 ? globalThis.scrollY / scrollable : 0;
  return clamp01((ratio - PROGRESS_START) / (PROGRESS_END - PROGRESS_START));
};

const GridCanvas: FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<Scene | null>(null);
  const dark = useDark();
  // The theme can change while the scene is still loading, so the scene reads the latest value when it is created.
  const darkRef = useRef(dark);

  useEffect(() => {
    darkRef.current = dark;
    sceneRef.current?.setDark(dark);
  }, [dark]);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const reduceMotion = globalThis.matchMedia('(prefers-reduced-motion: reduce)');

    let disposed = false;
    let scene: Scene | null = null;
    let frame = 0;
    let last = 0;
    const stop = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      last = 0;
    };

    const tick = (now: number) => {
      if (!scene) return;
      const delta = last ? (now - last) / 1000 : 1 / 60;
      last = now;
      scene.render(delta);
      frame = requestAnimationFrame(tick);
    };

    const start = () => {
      if (!scene || frame || document.hidden || reduceMotion.matches) return;
      frame = requestAnimationFrame(tick);
    };

    // Renders a single settled frame; used when motion is reduced.
    const renderStill = () => {
      if (!scene) return;
      for (let index = 0; index < 8; index++) scene.render(1 / 20);
    };

    const resize = () => {
      if (!scene) return;
      const { width, height } = container.getBoundingClientRect();
      scene.resize(width, height);
      scene.setProgress(measureProgress());
      if (reduceMotion.matches) renderStill();
    };

    const onScroll = () => {
      scene?.setScroll(globalThis.scrollY / Math.max(globalThis.innerHeight, 1));
      scene?.setProgress(measureProgress());
      if (reduceMotion.matches) renderStill();
    };

    const onPointerMove = (event: PointerEvent) => {
      scene?.setPointer(
        event.clientX / globalThis.innerWidth,
        1 - event.clientY / globalThis.innerHeight,
      );
    };

    const onVisibility = () => {
      if (document.hidden) stop();
      else start();
    };

    const onMotionChange = () => {
      stop();
      scene?.setReducedMotion(reduceMotion.matches);
      if (reduceMotion.matches) renderStill();
      else start();
    };

    const resizeObserver = new ResizeObserver(resize);

    void import('./scene').then(({ createScene }) => {
      if (disposed) return;
      scene = createScene({ canvas, dark: darkRef.current });
      if (!scene) return;

      sceneRef.current = scene;
      canvas.classList.add(styles['canvas--ready']!);

      scene.setReducedMotion(reduceMotion.matches);
      onScroll();
      resize();
      renderStill();

      resizeObserver.observe(container);
      globalThis.addEventListener('scroll', onScroll, { passive: true });
      globalThis.addEventListener('pointermove', onPointerMove, { passive: true });
      document.addEventListener('visibilitychange', onVisibility);
      reduceMotion.addEventListener('change', onMotionChange);
      start();
    });

    return () => {
      disposed = true;
      stop();
      resizeObserver.disconnect();
      globalThis.removeEventListener('scroll', onScroll);
      globalThis.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('visibilitychange', onVisibility);
      reduceMotion.removeEventListener('change', onMotionChange);
      scene?.dispose();
      sceneRef.current = null;
    };
  }, []);

  return (
    <div ref={containerRef} className={styles['stage']} aria-hidden="true">
      <canvas ref={canvasRef} className={styles['canvas']} />
    </div>
  );
};

export const HomeBackground: FC = () => {
  return (
    <>
      <BaseHomeBackground />
      <GridCanvas />
    </>
  );
};
