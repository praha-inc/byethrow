import { useI18n } from '@rspress/core/runtime';

import { HomeCtaMarkdown } from './home-cta-markdown';
import styles from './home-cta.module.css';
import { HomeAction } from '../../../foundations/home-action';
import { HomeInstall } from '../../../foundations/home-install';

import type { HomeActionProps } from '../../../foundations/home-action';
import type I18nJson from 'i18n';
import type { FC } from 'react';

/** Closing call to action shown after the features. */
export const HomeCta: FC = () => {
  const t = useI18n<typeof I18nJson>();
  const actions: readonly HomeActionProps[] = [
    { text: t('cta.primary'), link: './guide/start/introduction', theme: 'brand' },
    { text: t('cta.secondary'), link: './api/', theme: 'alt' },
  ];

  if (import.meta.env.SSG_MD) {
    return <HomeCtaMarkdown actions={actions} />;
  }

  return (
    <section className={styles['section']}>
      <div className={styles['panel']}>
        <div className={styles['text']}>
          <span className={styles['eyebrow']}>{t('cta.eyebrow')}</span>
          <h2 className={styles['title']}>{t('cta.title')}</h2>
          <p className={styles['description']}>{t('cta.description')}</p>
        </div>
        <div className={styles['side']}>
          <HomeInstall className={styles['install']} />
          <div className={styles['actions']}>
            {actions.map((action) => (
              <HomeAction key={action.link} {...action} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
