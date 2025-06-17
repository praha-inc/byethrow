import { describe, expectTypeOf, it } from 'vitest';

import { succeed } from './succeed';

import type { Result, ResultAsync } from '../result';

describe('succeed', () => {
  it('should return a Result when given a plain value', () => {
    const value = { id: '123', name: 'test' };
    const result = succeed(value);

    expectTypeOf(result).toEqualTypeOf<Result<{ id: string; name: string }, never>>();
  });

  it('should return a ResultAsync when given a Promise', () => {
    const value = Promise.resolve({ id: '123', name: 'test' });
    const result = succeed(value);

    expectTypeOf(result).toEqualTypeOf<ResultAsync<{ id: string; name: string }, never>>();
  });

  it('should return a Result with a no value', () => {
    const result = succeed();

    expectTypeOf(result).toEqualTypeOf<Result<void, never>>();
  });
});
