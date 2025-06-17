import { describe, expectTypeOf, it } from 'vitest';

import { fail } from './fail';
import { mapError } from './map-error';
import { pipe } from './pipe';

import type { Result, ResultAsync } from '../result';

describe('mapError', () => {
  describe('when used without the pipe function', () => {
    // eslint-disable-next-line unicorn/consistent-function-scoping
    const transform = (x: string) => x.length;

    describe('when Result is synchronous', () => {
      it('should transform the error type in a synchronous Result', () => {
        const input = fail('error');
        const result = mapError(transform)(input);

        expectTypeOf(result).toEqualTypeOf<Result<never, number>>();
      });
    });

    describe('when Result is asynchronous (Promise)', () => {
      it('should transform the error type in an asynchronous ResultAsync', () => {
        const input = fail(Promise.resolve('error'));
        const result = mapError(transform)(input);

        expectTypeOf(result).toEqualTypeOf<ResultAsync<never, number>>();
      });
    });
  });

  describe('when used with the pipe function', () => {
    describe('when Result is synchronous', () => {
      it('should transform the error type in a synchronous Result', () => {
        const input = fail('error');
        const result = pipe(
          input,
          mapError((x) => x.length),
        );

        expectTypeOf(result).toEqualTypeOf<Result<never, number>>();
      });
    });

    describe('when Result is asynchronous (Promise)', () => {
      it('should transform the error type in an asynchronous ResultAsync', () => {
        const input = fail(Promise.resolve('error'));
        const result = pipe(
          input,
          mapError((x) => x.length),
        );

        expectTypeOf(result).toEqualTypeOf<ResultAsync<never, number>>();
      });
    });
  });
});
