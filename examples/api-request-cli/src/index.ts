import { defineCommand, runMain } from 'citty';

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
});

void runMain(main);
