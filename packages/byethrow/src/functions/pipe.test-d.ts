import { describe, it, expectTypeOf } from 'vitest';

import { pipe } from './pipe';

describe('pipe', () => {
  it('should return the input value when no functions are provided', () => {
    expectTypeOf(pipe('test')).toEqualTypeOf<string>();
  });

  it('should apply a function', () => {
    const result = pipe(2, (x) => x + 3);

    expectTypeOf(result).toEqualTypeOf<number>();
  });

  it('should support complex types and chaining', () => {
    const result = pipe(
      [1, 2, 3],
      (array) => array.map((n) => n * 2),
      (array) => array.filter((n) => n > 3),
      (array) => array.reduce((accumulator, value) => accumulator + value, 0),
      (sum) => sum.toString(),
    );

    expectTypeOf(result).toEqualTypeOf<string>();
  });

  it('should handle a large number of functions', () => {
    const result = pipe(
      1,
      (x) => x + 1,
      (x) => x + 1,
      (x) => x + 1,
      (x) => x + 1,
      (x) => x + 1,
      (x) => x + 1,
      (x) => x + 1,
      (x) => x + 1,
      (x) => x + 1,
      (x) => x + 1,
      (x) => x + 1,
      (x) => x + 1,
      (x) => x + 1,
      (x) => x + 1,
      (x) => x + 1,
      (x) => x + 1,
      (x) => x + 1,
      (x) => x + 1,
      (x) => x + 1,
      (x) => x + 1,
      (x) => x + 1,
      (x) => x + 1,
      (x) => x + 1,
      (x) => x + 1,
      (x) => x + 1,
    );

    expectTypeOf(result).toEqualTypeOf<number>();
  });
});
