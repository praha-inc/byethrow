import { exit } from 'node:process';

import { defineCommand, runMain, showUsage } from 'citty';

import { describe } from './commands/describe';
import { list } from './commands/list';

const main = defineCommand({
  meta: {
    name: '@praha/byethrow-example-api-request-cli',
    description: 'An example CLI using @praha/byethrow for API requests and error handling',
  },
  subCommands: {
    list,
    describe,
  },
  run: async (context) => {
    await showUsage(context.cmd);
    exit(0);
  },
});

void runMain(main);
