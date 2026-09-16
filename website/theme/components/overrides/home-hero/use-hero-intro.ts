import { useEffect, useRef, useState } from 'react';

import type { CodeCardTab } from './code-card';

/** How long the `throw` version stays on screen before the hero switches to byethrow. */
const INTRO_DELAY = 2400;

export type HeroIntro = {
  tab: CodeCardTab;
  /** Goes up each time the hero lands on byethrow, which makes the hand wave. */
  waveKey: number;
  selectTab: (tab: CodeCardTab) => void;
};

/**
 * Opens on the `throw` version and switches to byethrow once: the tab changes,
 * "throw" in the title is struck through and the hand waves.
 * Picking a tab by hand cancels the intro and plays the same steps for that tab.
 */
export const useHeroIntro = (): HeroIntro => {
  const [tab, setTab] = useState<CodeCardTab>('before');
  const [waveKey, setWaveKey] = useState(0);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    // With reduced motion there is nothing to watch, so land on byethrow straight away.
    if (globalThis.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setTab('after');
      return;
    }
    timer.current = setTimeout(() => {
      setTab('after');
      setWaveKey((key) => key + 1);
    }, INTRO_DELAY);
    return () => clearTimeout(timer.current);
  }, []);

  const selectTab = (next: CodeCardTab) => {
    clearTimeout(timer.current);
    if (next === tab) return;
    setTab(next);
    if (next === 'after') setWaveKey((key) => key + 1);
  };

  return { tab, waveKey, selectTab };
};
