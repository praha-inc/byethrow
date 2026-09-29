import styles from './home-heading.module.css';

import type { FC } from 'react';

export type HomeHeadingProps = {
  eyebrow: string;
  title: string;
  description: string;
};

/** Heading shared by the sections of the home page. */
export const HomeHeading: FC<HomeHeadingProps> = ({ eyebrow, title, description }) => (
  <header className={styles['heading']}>
    <div className={styles['main']}>
      <span className={styles['eyebrow']}>{eyebrow}</span>
      <h2 className={styles['title']}>{title}</h2>
    </div>
    <p className={styles['description']}>{description}</p>
  </header>
);
