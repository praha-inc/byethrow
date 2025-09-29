import { exit } from 'node:process';

import { Result } from '@praha/byethrow';
import { defineCommand } from 'citty';

import { getPokemon } from '../client/get-pokemon';

export const describe = defineCommand({
  meta: {
    name: 'describe',
    description: 'Describe a pokemon',
  },
  args: {
    name: {
      type: 'positional',
    },
  },
  run: async ({ args }) => {
    await Result.pipe(
      getPokemon(args.name),
      Result.inspect((result) => {
        console.log(`Name: ${result.name}`);
        console.log(`Height: ${result.height / 10} m`);
        console.log(`Weight: ${result.weight / 10} kg`);
        console.log(`Types: ${result.types.map((type) => type.type.name).join(', ')}`);
      }),
      Result.inspectError((error) => {
        console.error(error);
        exit(1);
      }),
    );
  },
});
