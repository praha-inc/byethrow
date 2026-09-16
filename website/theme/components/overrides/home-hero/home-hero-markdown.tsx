import { parseInlineMarkdownText } from '@rspress/core/theme-original';
import { Fragment } from 'react';

import { HomeAction } from '../../foundations/home-action';

import type { Hero } from '@rspress/core';
import type { HomeHeroProps } from '@rspress/core/theme-original';
import type { FC } from 'react';

export type HomeHeroMarkdownProps = Pick<HomeHeroProps, 'beforeHeroActions' | 'afterHeroActions'> & {
  hero: Hero;
};

/** The hero as markdown, the same outline Rspress's own `HomeLayout` emits. */
export const HomeHeroMarkdown: FC<HomeHeroMarkdownProps> = ({
  hero,
  beforeHeroActions,
  afterHeroActions,
}) => {
  const subtitles = hero.text
    ? hero.text.toString().split(/\n/g).filter((text) => text !== '')
    : [];

  return (
    <>
      {hero.name && <h1>{parseInlineMarkdownText(hero.name)}</h1>}
      {subtitles.map((text) => (
        <p key={text}>{parseInlineMarkdownText(text)}</p>
      ))}
      {hero.tagline && <blockquote>{parseInlineMarkdownText(hero.tagline)}</blockquote>}
      {beforeHeroActions}
      {hero.actions && hero.actions.length > 0 && (
        <p>
          {hero.actions.map((action, index) => (
            <Fragment key={action.link}>
              {index > 0 && ' | '}
              <HomeAction text={action.text} link={action.link} theme={action.theme} />
            </Fragment>
          ))}
        </p>
      )}
      {afterHeroActions}
    </>
  );
};
