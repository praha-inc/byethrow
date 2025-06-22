import { describe, expectTypeOf, it } from 'vitest';

import { combine } from './combine';
import { fail } from './fail';
import { succeed } from './succeed';

import type { Result, ResultAsync } from '../result';

describe('combine', () => {
  describe('when input is an array', () => {
    it('should combine array of successful Results', () => {
      const result = combine([succeed(1), succeed(2), succeed(3)]);

      expectTypeOf(result).toEqualTypeOf<Result<[number, number, number], never[]>>();
    });

    it('should handle array with mixed success and failure types', () => {
      const result = combine([succeed(1), succeed('hello'), fail('error'), fail(true)]);

      expectTypeOf(result).toEqualTypeOf<Result<[number, string, never, never], (string | boolean)[]>>();
    });

    it('should handle async array input', () => {
      const result = combine([succeed(Promise.resolve(1)), succeed(Promise.resolve(2))]);

      expectTypeOf(result).toEqualTypeOf<ResultAsync<[number, number], never[]>>();
    });
  });

  describe('when input is an object', () => {
    it('should combine object of successful Results', () => {
      const input = {
        a: succeed(1),
        b: succeed('hello'),
        c: succeed(true),
      };
      const result = combine(input);

      expectTypeOf(result).toEqualTypeOf<Result<{ a: number; b: string; c: boolean }, never[]>>();
    });

    it('should handle object with mixed success and failure types', () => {
      const input = {
        a: succeed(1),
        b: succeed('hello'),
        c: fail('error'),
        d: fail(true),
      };
      const result = combine(input);

      expectTypeOf(result).toEqualTypeOf<Result<{ a: number; b: string; c: never; d: never }, (string | boolean)[]>>();
    });

    it('should handle async object input', () => {
      const input = {
        a: succeed(Promise.resolve(1)),
        b: succeed(Promise.resolve('hello')),
      };
      const result = combine(input);

      expectTypeOf(result).toEqualTypeOf<ResultAsync<{ a: number; b: string }, never[]>>();
    });
  });
});
