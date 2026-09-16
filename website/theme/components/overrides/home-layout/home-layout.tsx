import { HomeLayout as BaseHomeLayout } from '@rspress/core/theme-original';

import { HomeCta } from './home-cta';
import { HomeExamples } from './home-examples';
import { HomeLayoutMarkdown } from './home-layout-markdown';
import { HomeInstall } from '../../foundations/home-install';

import type { HomeLayoutProps } from '@rspress/core/theme-original';
import type { FC } from 'react';

export const HomeLayout: FC<HomeLayoutProps> = (props) => {
  if (import.meta.env.SSG_MD) {
    return <HomeLayoutMarkdown />;
  }

  return (
    <BaseHomeLayout
      {...props}
      afterHeroActions={<HomeInstall />}
      afterFeatures={(
        <>
          <HomeExamples />
          <HomeCta />
        </>
      )}
    />
  );
};
