import { describe, expectTypeOf, it } from 'vitest';

import { failSync } from './fail-sync';

import type { Result } from '../result';

describe('failSync', () => {
  it('should return a Result when given a plain error', () => {
    const result = failSync('error');

    expectTypeOf(result).toEqualTypeOf<Result<never, 'error'>>();
  });

  it('should return a Result with a no value', () => {
    const result = failSync();

    expectTypeOf(result).toEqualTypeOf<Result<never, void>>();
  });

  it('should wrap a Promise as-is without unwrapping', () => {
    const result = failSync(Promise.resolve('error'));

    expectTypeOf(result).toEqualTypeOf<Result<never, Promise<string>>>();
  });

  it('should resolve to Result<never, E> inside a generic function', () => {
    const wrapError = <E>(error: E) => {
      const result = failSync(error);

      expectTypeOf(result).toEqualTypeOf<Result<never, E>>();

      return result;
    };

    wrapError('oops');
  });

  it('should be assignable to Result<never, E> return type in a generic function', () => {
    const create = <E>(error: E): Result<never, E> => {
      return failSync(error);
    };

    expectTypeOf(create('oops')).toEqualTypeOf<Result<never, string>>();
  });
});
