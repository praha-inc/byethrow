import { exit } from 'node:process';

import { Result } from '@praha/byethrow';
import { defineCommand } from 'citty';

import { getPokemons } from '../client/get-pokemons';
import { stringToInteger } from '../internals/string-to-integer';

export const list = defineCommand({
  meta: {
    name: 'list',
    description: 'List all pokemons',
  },
  args: {
    page: {
      type: 'string',
      description: 'Page number',
      default: '1',
      alias: 'p',
    },
  },
  run: async ({ args }) => {
    await Result.pipe(
      stringToInteger(args.page),
      Result.andThen((page) => {
        return getPokemons(20 * (page - 1), 20);
      }),
      Result.inspect(({ results }) => {
        results.forEach(({ name }) => {
          console.log(name);
        });
        exit(0);
      }),
      Result.inspectError((error) => {
        console.error(error);
        exit(1);
      }),
    );
  },
});
