import styles from './wordmark.module.css';

import type { FC } from 'react';

export type WordmarkProps = {
  className?: string | undefined;
};

/** The "byethrow" name drawn like the hero title. Sized by the surrounding font size. */
export const Wordmark: FC<WordmarkProps> = ({ className }) => (
  <span className={[styles['wordmark'], className].filter(Boolean).join(' ')}>
    bye<em>throw</em>
  </span>
);
