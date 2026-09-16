import { useFrontmatter } from '@rspress/core/runtime';
import { renderHtmlOrText } from '@rspress/core/theme-original';

import { CodeCard } from './code-card';
import { HomeHeroMarkdown } from './home-hero-markdown';
import styles from './home-hero.module.css';
import { useHeroIntro } from './use-hero-intro';
import { WavingHand } from './waving-hand';
import { HomeAction } from '../../foundations/home-action';

import type { HomeHeroProps } from '@rspress/core/theme-original';
import type { FC } from 'react';

export const HomeHero: FC<HomeHeroProps> = ({
  beforeHeroActions,
  afterHeroActions,
  image,
}) => {
  const { frontmatter } = useFrontmatter();
  const { tab, waveKey, selectTab } = useHeroIntro();
  const hero = frontmatter.hero;
  if (!hero) return null;

  if (import.meta.env.SSG_MD) {
    return <HomeHeroMarkdown hero={hero} beforeHeroActions={beforeHeroActions} afterHeroActions={afterHeroActions} />;
  }

  const badge = typeof hero.badge === 'string' ? hero.badge : hero.badge?.text;
  const subtitles = hero.text
    ? hero.text.toString().split(/\n/g).filter((text) => text !== '')
    : [];

  return (
    <section className={styles['hero']}>
      <div className={styles['container']}>
        {badge && (
          <div className={styles['badge']}>
            <span className={styles['badge-dot']} />
            <span {...renderHtmlOrText(badge)} />
          </div>
        )}
        <div className={styles['heading']}>
          <h1 className={styles['title']} data-struck={tab === 'after'} {...renderHtmlOrText(hero.name)} />
          {subtitles.map((text) => (
            <p key={text} className={styles['subtitle']} {...renderHtmlOrText(text)} />
          ))}
        </div>
        {hero.tagline && (
          <p className={styles['tagline']} {...renderHtmlOrText(hero.tagline)} />
        )}
        {beforeHeroActions}
        {hero.actions && hero.actions.length > 0 && (
          <div className={styles['actions']}>
            {hero.actions.map((action) => (
              <HomeAction key={action.link} text={action.text} link={action.link} theme={action.theme} />
            ))}
          </div>
        )}
        {afterHeroActions && <div className={styles['after-actions']}>{afterHeroActions}</div>}
      </div>
      <div className={styles['visual']}>
        <div className={styles['visual-glow']} />
        {image ?? (
          <div className={styles['stage']}>
            <CodeCard tab={tab} onTabChange={selectTab} />
            <WavingHand waveKey={waveKey} className={styles['hand']} />
          </div>
        )}
      </div>
    </section>
  );
};
