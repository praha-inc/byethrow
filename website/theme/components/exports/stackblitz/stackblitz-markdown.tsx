import { useI18n } from '@rspress/core/runtime';

import type { StackblitzProps } from './stackblitz';
import type I18nJson from 'i18n';
import type { FC } from 'react';

/** A link to the project on StackBlitz, standing in for the embed that markdown can't hold. */
export const StackblitzMarkdown: FC<StackblitzProps> = ({ repository, options }) => {
  const t = useI18n<typeof I18nJson>();
  const url = new URL(`https://stackblitz.com/github/${repository}`);
  for (const file of [options?.openFile ?? []].flat()) {
    url.searchParams.append('file', file);
  }

  return (
    <p>
      <a href={url.href}>{t('stackblitz.open')}</a>
    </p>
  );
};
