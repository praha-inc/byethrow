import { useI18n } from '@rspress/core/runtime';
import { Link } from '@rspress/core/theme-original';
import { useEffect, useRef } from 'react';

import { HomeFeatureMarkdown } from './home-features-markdown';
import styles from './home-features.module.css';
import {
  AsyncVisual,
  EcosystemVisual,
  ObjectsVisual,
  PipelineVisual,
  ResultVisual,
  TreeshakeVisual,
} from './visuals';
import { HomeHeading } from '../../foundations/home-heading';

import type I18nJson from 'i18n';
import type { FC, ReactNode } from 'react';

type FeatureKey = 'result' | 'objects' | 'pipeline' | 'async' | 'treeshake' | 'ecosystem';

export type Feature = {
  key: FeatureKey;
  /** Grid columns the card spans on wide screens. */
  span: 1 | 2;
  href: string;
  visual: ReactNode;
};

const FEATURES: readonly Feature[] = [
  { key: 'result', span: 2, href: './guide/tutorial/basics/result-type', visual: <ResultVisual /> },
  { key: 'objects', span: 1, href: './guide/best-practices/result-vs-throw', visual: <ObjectsVisual /> },
  { key: 'async', span: 1, href: './api/modules/Result', visual: <AsyncVisual /> },
  { key: 'pipeline', span: 2, href: './guide/tutorial/chaining/pipe-basics', visual: <PipelineVisual /> },
  { key: 'treeshake', span: 2, href: './guide/best-practices/importing-result', visual: <TreeshakeVisual /> },
  { key: 'ecosystem', span: 1, href: './guide/ecosystem/linter', visual: <EcosystemVisual /> },
];

/** Reveals cards as they scroll into view. */
const useReveal = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    const cards = [...root.querySelectorAll<HTMLElement>('[data-reveal]')];
    if (!('IntersectionObserver' in globalThis)) {
      for (const card of cards) card.dataset['reveal'] = 'visible';
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        (entry.target as HTMLElement).dataset['reveal'] = 'visible';
        observer.unobserve(entry.target);
      }
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.15 });

    for (const card of cards) observer.observe(card);
    return () => observer.disconnect();
  }, []);

  return ref;
};

export const HomeFeature: FC = () => {
  const t = useI18n<typeof I18nJson>();
  const gridRef = useReveal();

  if (import.meta.env.SSG_MD) {
    return <HomeFeatureMarkdown features={FEATURES} />;
  }

  return (
    <section className={styles['section']}>
      <HomeHeading
        eyebrow={t('features.eyebrow')}
        title={t('features.title')}
        description={t('features.description')}
      />
      <div ref={gridRef} className={styles['grid']}>
        {FEATURES.map((feature, index) => (
          <article
            key={feature.key}
            data-reveal
            className={[
              styles['card'],
              feature.span === 2 && styles['card--wide'],
            ].filter(Boolean).join(' ')}
            style={{ transitionDelay: `${(index % 3) * 80}ms` }}
          >
            <div className={styles['stage']}>
              <div className={styles['stage-inner']}>{feature.visual}</div>
            </div>
            <div className={styles['card-text']}>
              <h3 className={styles['card-title']}>
                <span className={styles['index']}>{String(index + 1).padStart(2, '0')}</span>
                {t(`features.${feature.key}.title`)}
              </h3>
              <p className={styles['card-description']}>{t(`features.${feature.key}.description`)}</p>
              <Link href={feature.href} className={styles['more'] ?? ''}>
                {t('features.learnMore')}
                <svg className={styles['more-arrow']} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M3 8h10M9 4l4 4-4 4" />
                </svg>
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};
