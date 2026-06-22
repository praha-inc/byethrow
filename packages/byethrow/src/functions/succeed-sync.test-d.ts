import { describe, expectTypeOf, it } from 'vitest';

import { succeedSync } from './succeed-sync';

import type { Result } from '../result';

describe('succeedSync', () => {
  it('should return a Result when given a plain value', () => {
    const result = succeedSync({ id: '123', name: 'Alice' });

    expectTypeOf(result).toEqualTypeOf<Result<{ readonly id: '123'; readonly name: 'Alice' }, never>>();
  });

  it('should return a Result with a no value', () => {
    const result = succeedSync();

    expectTypeOf(result).toEqualTypeOf<Result<void, never>>();
  });

  it('should wrap a Promise as-is without unwrapping', () => {
    const result = succeedSync(Promise.resolve(42));

    expectTypeOf(result).toEqualTypeOf<Result<Promise<number>, never>>();
  });

  it('should resolve to Result<T, never> inside a generic function', () => {
    const wrap = <T>(value: T) => {
      const result = succeedSync(value);

      expectTypeOf(result).toEqualTypeOf<Result<T, never>>();

      return result;
    };

    wrap(42);
  });

  it('should be assignable to Result<T, never> return type in a generic function', () => {
    const create = <T>(value: T): Result<T, never> => {
      return succeedSync(value);
    };

    expectTypeOf(create(42)).toEqualTypeOf<Result<number, never>>();
  });

  it('should allow .type access inside a generic function', () => {
    const check = <T>(value: T) => {
      const result = succeedSync(value);

      expectTypeOf(result.type).toEqualTypeOf<'Success' | 'Failure'>();
    };

    check(42);
  });
});
