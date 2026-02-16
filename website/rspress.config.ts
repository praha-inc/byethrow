import { defineConfig } from '@rspress/core';
import { pluginSitemap } from '@rspress/plugin-sitemap';
import { pluginTwoslash } from '@rspress/plugin-twoslash';
import { pluginOpenGraph } from 'rsbuild-plugin-open-graph';
import pluginOg from 'rspress-plugin-og';

import { pluginTypedoc } from './plugins/typedoc';

const siteUrl = 'https://praha-inc.github.io/byethrow';

export default defineConfig({
  title: 'byethrow',
  base: '/byethrow/',
  description: 'A lightweight, tree-shakable Result type library for type-safe error handling in TypeScript.',
  icon: '/waving-hand.png',
  logo: '/waving-hand.png',
  logoText: 'byethrow',
  llms: true,
  plugins: [
    pluginSitemap({ siteUrl }),
    pluginTwoslash({ explicitTrigger: false }),
    pluginTypedoc(),
    pluginOg({
      domain: siteUrl,
      maxTitleSizePerLine: 20,
    }),
  ],
  lang: 'en',
  languageParity: {
    enabled: true,
    exclude: ['api'],
  },
  locales: [
    {
      lang: 'en',
      label: 'English',
    },
    {
      lang: 'ja',
      label: '日本語',
    },
  ],
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
  builderConfig: {
    plugins: [
      pluginOpenGraph({
        url: siteUrl,
        twitter: {
          card: 'summary_large_image',
        },
      }),
    ],
  },
});
