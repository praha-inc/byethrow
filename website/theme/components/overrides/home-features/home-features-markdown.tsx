import { useI18n } from '@rspress/core/runtime';

import type { Feature } from './home-features';
import type I18nJson from 'i18n';
import type { FC } from 'react';

export type HomeFeatureMarkdownProps = {
  features: readonly Feature[];
};

/** The features as a markdown list. They live in i18n rather than frontmatter, so Rspress can't emit them. */
export const HomeFeatureMarkdown: FC<HomeFeatureMarkdownProps> = ({ features }) => {
  const t = useI18n<typeof I18nJson>();

  return (
    <>
      <h2>{t('features.title')}</h2>
      <p>{t('features.description')}</p>
      <ul>
        {features.map(({ key, href }) => (
          <li key={key}>
            <a href={href}><strong>{t(`features.${key}.title`)}</strong></a>
            {': '}
            {t(`features.${key}.description`)}
          </li>
        ))}
      </ul>
    </>
  );
};
