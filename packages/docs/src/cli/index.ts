import { defineCommand, runMain } from 'citty';

import { searchCommand } from './commands/search.js';

const main = defineCommand({
  meta: {
    name: '@praha/byethrowｰdocs',
    version: BYETHROW_DOCS_VERSION,
    description: 'Documentation CLI for @praha/byethrow',
  },
  subCommands: {
    search: searchCommand,
  },
});

export const run = () => runMain(main);
