import { defineCommand, runMain } from 'citty';

const main = defineCommand({
  meta: {
    name: '@praha/byethrowｰdocs',
    version: BYETHROW_DOCS_VERSION,
    description: 'Documentation CLI for @praha/byethrow',
  },
  subCommands: {
    init: () => import('./commands/init').then((module) => module.default),
    list: () => import('./commands/list').then((module) => module.default),
    search: () => import('./commands/search').then((module) => module.default),
    toc: () => import('./commands/toc').then((module) => module.default),
  },
});

export const run = () => runMain(main);
