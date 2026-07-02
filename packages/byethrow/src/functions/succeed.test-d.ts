import { describe, expectTypeOf, it } from 'vitest';

import { succeed } from './succeed';

import type { Result } from '../result';

describe('succeed', () => {
  it('should return a Result when given a plain value', () => {
    const result = succeed(42);

    expectTypeOf(result).toEqualTypeOf<Result<42, never>>();
  });

  it('should return a Result when given a Promise', () => {
    const result = succeed(Promise.resolve(42));

    expectTypeOf(result).toEqualTypeOf<Result<Promise<number>, never>>();
  });

  it('should return a Result with a no value', () => {
    const result = succeed();

    expectTypeOf(result).toEqualTypeOf<Result<void, never>>();
  });
});
