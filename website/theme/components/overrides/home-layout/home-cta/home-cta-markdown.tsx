import { useI18n } from '@rspress/core/runtime';
import { Fragment } from 'react';

import { HomeAction } from '../../../foundations/home-action';

import type { HomeActionProps } from '../../../foundations/home-action';
import type I18nJson from 'i18n';
import type { FC } from 'react';

export type HomeCtaMarkdownProps = {
  actions: readonly HomeActionProps[];
};

/** The closing call to action as markdown. The install commands already appear under the hero. */
export const HomeCtaMarkdown: FC<HomeCtaMarkdownProps> = ({ actions }) => {
  const t = useI18n<typeof I18nJson>();

  return (
    <>
      <h2>{t('cta.title')}</h2>
      <p>{t('cta.description')}</p>
      <p>
        {actions.map((action, index) => (
          <Fragment key={action.link}>
            {index > 0 && ' | '}
            <HomeAction {...action} />
          </Fragment>
        ))}
      </p>
    </>
  );
};
