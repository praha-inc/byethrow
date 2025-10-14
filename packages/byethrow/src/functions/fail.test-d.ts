import { describe, expectTypeOf, it } from 'vitest';

import { fail } from './fail';

import type { Result, ResultAsync } from '../result';

describe('fail', () => {
  it('should return a Result when given a plain error', () => {
    const result = fail('error');

    expectTypeOf(result).toEqualTypeOf<Result<never, 'error'>>();
  });

  it('should return a ResultAsync when given a Promise of error', () => {
    const error = Promise.resolve('error' as const);
    const result = fail(error);

    expectTypeOf(result).toEqualTypeOf<ResultAsync<never, 'error'>>();
  });

  it('should return a Result with a no value', () => {
    const result = fail();

    expectTypeOf(result).toEqualTypeOf<Result<never, void>>();
  });
});
