import { HomeCta } from './home-cta';
import { HomeExamples } from './home-examples';
import { HomeInstall } from '../../foundations/home-install';
import { HomeFeature } from '../home-features';
import { HomeHero } from '../home-hero';

import type { FC } from 'react';

/**
 * Rspress renders each page's markdown export and llms.txt by re-running the
 * theme in an `SSG_MD` pass. There the base `HomeLayout` skips its sections and
 * only emits the frontmatter hero and features, while most of this home page is
 * hardcoded in components. So the sections are laid out here directly, in the
 * same order as the page, and each of them writes itself out as markdown.
 */
export const HomeLayoutMarkdown: FC = () => (
  <>
    <HomeHero afterHeroActions={<HomeInstall />} />
    <HomeFeature />
    <HomeExamples />
    <HomeCta />
  </>
);
