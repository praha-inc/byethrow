import { Result } from '@praha/byethrow';
import * as v from 'valibot';

import { fetch } from '../internals/fetch';

const schema = v.object({
  name: v.string(),
  height: v.number(),
  weight: v.number(),
  types: v.array(v.object({
    type: v.object({
      name: v.string(),
    }),
  })),
});

export const getPokemon = (name: string) => {
  return Result.pipe(
    fetch(`https://pokeapi.co/api/v2/pokemon/${name}`),
    Result.andThen(Result.parse(schema)),
  );
};
