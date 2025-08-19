import { defineConfig } from '@rspress/core';
import { pluginLlms } from '@rspress/plugin-llms';
import { pluginSitemap } from '@rspress/plugin-sitemap';

import { pluginTwoslash } from './plugins/twoslash';
import { pluginTypedoc } from './plugins/typedoc';

export default defineConfig({
  title: 'byethrow',
  base: '/byethrow/',
  description: 'A lightweight, tree-shakable Result type package with a simple, consistent API designed.',
  icon: '/waving-hand.png',
  logo: '/waving-hand.png',
  logoText: 'byethrow',
  plugins: [
    pluginLlms(),
    pluginSitemap({ siteUrl: 'https://praha-inc.github.io/byethrow' }),
    pluginTwoslash(),
    pluginTypedoc(),
  ],
  markdown: {
    link: {
      checkDeadLinks: true,
    },
  },
  route: {
    cleanUrls: true,
  },
  themeConfig: {
    lastUpdated: true,
    socialLinks: [
      {
        icon: 'github',
        mode: 'link',
        content: 'https://github.com/praha-inc/byethrow',
      },
    ],
    editLink: {
      docRepoBaseUrl: 'https://github.com/praha-inc/byethrow/tree/main/website/docs',
    },
    footer: {
      message: `© ${new Date().getFullYear()} PrAha, Inc.`,
    },
  },
});
