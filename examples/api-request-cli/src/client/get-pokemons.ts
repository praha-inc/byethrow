import { Result } from '@praha/byethrow';
import * as v from 'valibot';

import { fetch } from '../internals/fetch';

const schema = v.object({
  results: v.array(v.object({
    name: v.string(),
  })),
});

export const getPokemons = (offset: number, limit: number) => {
  return Result.pipe(
    fetch(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`),
    Result.andThen(Result.parse(schema)),
  );
};
