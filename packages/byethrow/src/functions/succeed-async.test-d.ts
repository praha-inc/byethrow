import { describe, expectTypeOf, it } from 'vitest';

import { succeedAsync } from './succeed-async';

import type { ResultAsync } from '../result';

describe('succeedAsync', () => {
  it('should return a ResultAsync when given a Promise', () => {
    const result = succeedAsync(Promise.resolve(42));

    expectTypeOf(result).toEqualTypeOf<ResultAsync<number, never>>();
  });

  it('should return a ResultAsync with an object value', () => {
    const result = succeedAsync(Promise.resolve({ id: '123', name: 'Alice' }));

    expectTypeOf(result).toEqualTypeOf<ResultAsync<{ id: string; name: string }, never>>();
  });
});
