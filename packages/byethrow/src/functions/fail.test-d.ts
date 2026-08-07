import { describe, expectTypeOf, it } from 'vitest';

import { fail } from './fail';

import type { Result } from '../result';

describe('fail', () => {
  it('should return a Result when given a plain error', () => {
    const result = fail('error');

    expectTypeOf(result).toEqualTypeOf<Result<never, 'error'>>();
  });

  it('should return never when given a Promise of error', () => {
    const result = fail(Promise.resolve('error'));

    expectTypeOf(result).toEqualTypeOf<never>();
  });

  it('should return a Result with a no value', () => {
    const result = fail();

    expectTypeOf(result).toEqualTypeOf<Result<never, void>>();
  });
});
