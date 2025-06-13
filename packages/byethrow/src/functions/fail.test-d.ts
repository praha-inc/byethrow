import { describe, expectTypeOf, it } from 'vitest';

import { fail } from './fail';

import type { Result, ResultAsync } from '../result';

describe('fail', () => {
  it('should return a Result when given a plain error', () => {
    const error = new Error('Test error');
    const result = fail(error);

    expectTypeOf(result).toEqualTypeOf<Result<never, Error>>();
  });

  it('should return a ResultAsync when given a Promise of error', () => {
    const error = Promise.resolve(new Error('Test promise error'));
    const result = fail(error);

    expectTypeOf(result).toEqualTypeOf<ResultAsync<never, Error>>();
  });
});
