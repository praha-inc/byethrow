import { useI18n } from '@rspress/core/runtime';
import { useEffect, useRef, useState } from 'react';

import { PIPELINES, tracePipeline } from './pipelines';
import { ResultPipelineMarkdown } from './result-pipeline-markdown';
import styles from './result-pipeline.module.css';
import { usePlaying } from '../../../hooks/use-playing';
import { laneLabel } from '../result-flow/flows';

import type { PipelineName, PipelineStep, StepTrace } from './pipelines';
import type { Track } from '../result-flow/flows';
import type I18nJson from 'i18n';
import type { FC, RefObject } from 'react';

const cx = (...names: Array<string | undefined | false>): string => names.filter(Boolean).join(' ');

const TRACKS: readonly Track[] = ['success', 'failure'];

/* Layout in pixels: a row per step plus one for the result, with the two rails running down beside them. */
const ROW_HEIGHT = 44;
/** Narrow figures put the outcome below the code, so their rows are taller; the stylesheet switches at the same width. */
const COMPACT_ROW_HEIGHT = 64;
const COMPACT_WIDTH = 480;
const RAILS_WIDTH = 68;
const RAIL_X: Readonly<Record<Track, number>> = { success: 20, failure: 48 };
const STATION_SIZE = 12;
const DOT_RADIUS = 5;

const STEP_MS = 650;
const HOLD_MS = 1200;
const FADE_IN_MS = 150;
const FADE_OUT_MS = 300;

const rowYOf = (index: number, rowHeight: number): number => index * rowHeight + rowHeight / 2;

type Segment = { d: string; track: Track };

type Route = {
  /** The way from each row to the next, bending to the other rail when a step moves the Result there. */
  segments: readonly Segment[];
  /** All the segments as one path, for the dot to follow. */
  path: string;
};

const routeOf = (traces: readonly StepTrace[], rowHeight: number): Route => {
  const moves = traces.map(({ input, output }, index) => {
    const [x1, x2, y1, y2] = [RAIL_X[input], RAIL_X[output], rowYOf(index, rowHeight), rowYOf(index + 1, rowHeight)];
    const move = x1 === x2 ? `V${y2}` : `C${x1} ${y1 + rowHeight / 2}, ${x2} ${y2 - rowHeight / 2}, ${x2} ${y2}`;
    return { start: `M${x1} ${y1}`, move, track: output };
  });

  return {
    segments: moves.map(({ start, move, track }) => ({ d: `${start} ${move}`, track })),
    path: [moves[0]?.start ?? '', ...moves.map(({ move }) => move)].join(' '),
  };
};

/** The track of the rail nearest to `x`, which a dot crossing between the rails switches to halfway. */
const trackAt = (x: number): Track => (x < (RAIL_X.success + RAIL_X.failure) / 2 ? 'success' : 'failure');

/** The height of a row, which grows when the figure is too narrow to put the outcome beside the code. */
const useRowHeight = (ref: RefObject<HTMLElement | null>): number => {
  const [rowHeight, setRowHeight] = useState(ROW_HEIGHT);

  useEffect(() => {
    const element = ref.current;
    if (!element || !('ResizeObserver' in globalThis)) return;

    const observer = new ResizeObserver(([entry]) => {
      setRowHeight(entry && entry.contentRect.width < COMPACT_WIDTH ? COMPACT_ROW_HEIGHT : ROW_HEIGHT);
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, [ref]);

  return rowHeight;
};

/** Where a step sits: on the rail it runs on, or for the first Result, on the track it starts on. */
const stationTrackOf = (step: PipelineStep, trace: StepTrace): Track => {
  return step.runsOn === 'start' ? trace.output : step.runsOn;
};

export type ResultPipelineProps = {
  /** The pipeline to simulate. */
  name: PipelineName;
};

/**
 * The steps of a pipeline beside the two rails. The reader picks how each step that
 * can change the track ends, and a dot follows the Result from the first step to the
 * last, passing by the steps that run on the other track.
 */
export const ResultPipeline: FC<ResultPipelineProps> = ({ name }) => {
  const t = useI18n<typeof I18nJson>();
  const steps: readonly PipelineStep[] = PIPELINES[name];
  const figureRef = useRef<HTMLElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const dotRef = useRef<SVGCircleElement>(null);
  const playing = usePlaying(figureRef);
  const rowHeight = useRowHeight(figureRef);
  const [choices, setChoices] = useState<ReadonlyArray<Track | undefined>>([]);
  const [activeRow, setActiveRow] = useState<number | null>(null);
  const traces = tracePipeline(steps, choices);
  const { segments, path } = routeOf(traces, rowHeight);
  const result = traces.at(-1)?.output ?? 'success';

  useEffect(() => {
    const element = pathRef.current;
    const dot = dotRef.current;
    if (!element || !dot) return;
    if (!playing) {
      dot.style.opacity = '0';
      setActiveRow(null);
      return;
    }

    const length = element.getTotalLength();
    const travelMs = steps.length * STEP_MS;
    let start: number | undefined;
    let frame = 0;

    const tick = (now: number) => {
      start ??= now;
      const elapsed = (now - start) % (travelMs + HOLD_MS);
      const point = element.getPointAtLength(Math.min(elapsed / travelMs, 1) * length);

      dot.setAttribute('cx', String(point.x));
      dot.setAttribute('cy', String(point.y));
      dot.dataset['track'] = trackAt(point.x);
      dot.style.opacity = String(Math.max(0, Math.min(1, elapsed / FADE_IN_MS, (travelMs + HOLD_MS - elapsed) / FADE_OUT_MS)));
      setActiveRow(Math.round((point.y - rowYOf(0, rowHeight)) / rowHeight));
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [path, playing, rowHeight, steps.length]);

  if (import.meta.env.SSG_MD) {
    return <ResultPipelineMarkdown name={name} />;
  }

  const choose = (index: number, track: Track) => {
    setChoices((current) => {
      const next = [...current];
      next[index] = track;
      return next;
    });
  };

  return (
    <figure ref={figureRef} className={cx('rp-not-doc', styles['figure'])}>
      <figcaption className={styles['header']}>
        <span className={styles['legend']}>
          {TRACKS.map((track) => (
            <span key={track} className={styles['legend-item']}>
              <i className={cx(styles['legend-dot'], styles[`legend-dot--${track}`])} />
              {laneLabel(track)}
            </span>
          ))}
        </span>
        <span className={styles['hint']}>{t('resultPipeline.hint')}</span>
      </figcaption>
      <div className={styles['body']} style={{ gridTemplateRows: `repeat(${steps.length + 1}, ${rowHeight}px)` }}>
        <svg
          className={styles['rails']}
          width={RAILS_WIDTH}
          height={(steps.length + 1) * rowHeight}
          viewBox={`0 0 ${RAILS_WIDTH} ${(steps.length + 1) * rowHeight}`}
          aria-hidden="true"
        >
          {TRACKS.map((track) => (
            <line
              key={track}
              className={cx(styles['rail'], styles[`rail--${track}`])}
              x1={RAIL_X[track]}
              y1={rowYOf(0, rowHeight)}
              x2={RAIL_X[track]}
              y2={rowYOf(steps.length, rowHeight)}
            />
          ))}
          {segments.map(({ d, track }) => (
            <path key={d} className={cx(styles['route'], styles[`route--${track}`])} d={d} />
          ))}
          <path ref={pathRef} className={styles['measure']} d={path} />
          {steps.map((step, index) => {
            const trace = traces[index];
            if (!trace) return null;
            const track = stationTrackOf(step, trace);
            return (
              <rect
                key={step.code}
                className={cx(styles['station'], styles[`station--${track}`], !trace.runs && styles['station--skipped'])}
                x={RAIL_X[track] - STATION_SIZE / 2}
                y={rowYOf(index, rowHeight) - STATION_SIZE / 2}
                width={STATION_SIZE}
                height={STATION_SIZE}
                rx="3"
              />
            );
          })}
          <circle className={cx(styles['end'], styles[`end--${result}`])} cx={RAIL_X[result]} cy={rowYOf(steps.length, rowHeight)} r="7" />
          <circle ref={dotRef} className={styles['dot']} r={DOT_RADIUS} />
        </svg>
        {steps.map((step, index) => {
          const trace = traces[index];
          if (!trace) return null;
          return (
            <div
              key={step.code}
              className={cx(styles['row'], !trace.runs && styles['row--skipped'], index === activeRow && styles['row--active'])}
            >
              <code className={styles['code']}>{step.code}</code>
              {trace.runs && step.outcomes.length > 1 && (
                <span className={styles['toggle']} role="group" aria-label={step.code}>
                  {TRACKS.map((track) => (
                    <button
                      key={track}
                      type="button"
                      className={cx(styles['option'], styles[`option--${track}`])}
                      aria-pressed={trace.output === track}
                      onClick={() => choose(index, track)}
                    >
                      {laneLabel(track)}
                    </button>
                  ))}
                </span>
              )}
              {!trace.runs && <span className={styles['skipped']}>{t('resultPipeline.skipped')}</span>}
            </div>
          );
        })}
        <div className={cx(styles['row'], styles['row--result'], steps.length === activeRow && styles['row--active'])}>
          <span className={styles['result-label']}>{t('resultPipeline.result')}</span>
          <span className={cx(styles['value'], styles[`value--${result}`])}>{laneLabel(result)}</span>
        </div>
      </div>
    </figure>
  );
};
