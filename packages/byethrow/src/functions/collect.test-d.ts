import { describe, expectTypeOf, it } from 'vitest';

import { collect } from './collect';
import { fail } from './fail';
import { succeed } from './succeed';

import type { Result, ResultAsync } from '../result';

describe('collect', () => {
  describe('when collecting an object of Results', () => {
    describe('when all Results are synchronous', () => {
      it('should return a synchronous Result with object of values', () => {
        const result = collect({
          name: succeed('Alice'),
          age: succeed(20),
        });

        expectTypeOf(result).toEqualTypeOf<Result<{ name: 'Alice'; age: 20 }, never[]>>();
      });

      it('should return a synchronous Result with error array when some fail', () => {
        const result = collect({
          name: succeed('Alice'),
          age: fail('Invalid age'),
        });

        expectTypeOf(result).toEqualTypeOf<Result<{ name: 'Alice'; age: never }, 'Invalid age'[]>>();
      });
    });

    describe('when some Results are asynchronous', () => {
      it('should return a ResultAsync with object of values', () => {
        const result = collect({
          name: succeed(Promise.resolve('Alice')),
          age: succeed(20),
        });

        expectTypeOf(result).toEqualTypeOf<ResultAsync<{ name: string; age: 20 }, never[]>>();
      });

      it('should return a ResultAsync with error array when some fail', () => {
        const result = collect({
          name: succeed(Promise.resolve('Alice')),
          age: fail('Invalid age'),
        });

        expectTypeOf(result).toEqualTypeOf<ResultAsync<{ name: string; age: never }, 'Invalid age'[]>>();
      });
    });
  });

  describe('when collecting an array of Results', () => {
    describe('when all Results are synchronous', () => {
      it('should return a synchronous Result with array of values', () => {
        const result = collect([
          succeed(1),
          succeed(2),
          succeed(3),
        ]);

        expectTypeOf(result).toEqualTypeOf<Result<[1, 2, 3], never[]>>();
      });

      it('should return a synchronous Result with error array when some fail', () => {
        const result = collect([
          succeed(1),
          fail('error1'),
          fail('error2'),
        ]);

        expectTypeOf(result).toEqualTypeOf<Result<[1, never, never], ('error1' | 'error2')[]>>();
      });
    });

    describe('when some Results are asynchronous', () => {
      it('should return a ResultAsync with array of values', () => {
        const result = collect([
          succeed(Promise.resolve(1)),
          succeed(2),
          succeed(3),
        ]);

        expectTypeOf(result).toEqualTypeOf<ResultAsync<[number, 2, 3], never[]>>();
      });

      it('should return a ResultAsync with error array when some fail', () => {
        const result = collect([
          succeed(Promise.resolve(1)),
          fail('error1'),
          fail('error2'),
        ]);

        expectTypeOf(result).toEqualTypeOf<ResultAsync<[number, never, never], ('error1' | 'error2')[]>>();
      });
    });
  });

  describe('when collecting an array with a mapping function', () => {
    describe('when the mapping function returns synchronous Results', () => {
      it('should return a synchronous Result with array of mapped values', () => {
        const result = collect([1, 2, 3], (x) => succeed(x.toString()));

        expectTypeOf(result).toEqualTypeOf<Result<[string, string, string], never[]>>();
      });

      it('should return a synchronous Result with error array when some fail', () => {
        const result = collect([1, 2, 3], (x) => x > 1 ? fail(x.toString()) : succeed(x.toString()));

        expectTypeOf(result).toEqualTypeOf<Result<[string, string, string], string[]>>();
      });
    });

    describe('when the mapping function returns asynchronous Results', () => {
      it('should return a ResultAsync with array of mapped values', () => {
        const result = collect([1, 2, 3], (x) => succeed(Promise.resolve(x.toString())));

        expectTypeOf(result).toEqualTypeOf<ResultAsync<[string, string, string], never[]>>();
      });

      it('should return a ResultAsync with error array when some fail', () => {
        const result = collect([1, 2, 3], (x) => x > 1 ? fail(Promise.resolve(x.toString())) : succeed(Promise.resolve(x.toString())));

        expectTypeOf(result).toEqualTypeOf<ResultAsync<[string, string, string], string[]>>();
      });
    });
  });
});
