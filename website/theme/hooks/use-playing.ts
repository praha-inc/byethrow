import { useEffect, useState } from 'react';

import type { RefObject } from 'react';

/** Whether the element is on screen and the reader allows motion, so that an animation is worth running. */
export const usePlaying = (ref: RefObject<HTMLElement | null>): boolean => {
  const [visible, setVisible] = useState(false);
  const [motion, setMotion] = useState(false);

  useEffect(() => {
    const query = matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setMotion(!query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (!('IntersectionObserver' in globalThis)) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(([entry]) => setVisible(entry?.isIntersecting ?? false));
    observer.observe(element);
    return () => observer.disconnect();
  }, [ref]);

  return visible && motion;
};
