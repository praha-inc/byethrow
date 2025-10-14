import { describe, expectTypeOf, it } from 'vitest';

import { succeed } from './succeed';

import type { Result, ResultAsync } from '../result';

describe('succeed', () => {
  it('should return a Result when given a plain value', () => {
    const result = succeed({ id: '123', name: 'Alice' });

    expectTypeOf(result).toEqualTypeOf<Result<{ readonly id: '123'; readonly name: 'Alice' }, never>>();
  });

  it('should return a ResultAsync when given a Promise', () => {
    const result = succeed(Promise.resolve({ id: '123', name: 'Alice' } as const));

    expectTypeOf(result).toEqualTypeOf<ResultAsync<{ readonly id: '123'; readonly name: 'Alice' }, never>>();
  });

  it('should return a Result with a no value', () => {
    const result = succeed();

    expectTypeOf(result).toEqualTypeOf<Result<void, never>>();
  });
});
