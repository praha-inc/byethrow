import { Link, renderHtmlOrText } from '@rspress/core/theme-original';

import { HomeActionMarkdown } from './home-action-markdown';

import type { FC } from 'react';

const ArrowIcon: FC = () => (
  <svg className="bt-button__icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M3 8h10M9 4l4 4-4 4" />
  </svg>
);

export type HomeActionProps = {
  text: string;
  link: string;
  theme?: 'brand' | 'alt' | undefined;
};

/** A call-to-action link styled as a button. The brand variant carries an arrow. */
export const HomeAction: FC<HomeActionProps> = ({ text, link, theme = 'brand' }) => {
  if (import.meta.env.SSG_MD) {
    return <HomeActionMarkdown text={text} link={link} />;
  }

  return (
    <Link href={link} className={`bt-button bt-button--${theme}`}>
      <span {...renderHtmlOrText(text)} />
      {theme === 'brand' && <ArrowIcon />}
    </Link>
  );
};
