import { describe, expectTypeOf, it } from 'vitest';

import { assertFailure } from './assert-failure';
import { fail } from './fail';
import { pipe } from './pipe';
import { succeed } from './succeed';

import type { Failure } from '../result';

describe('assertFailure', () => {
  describe('when used without the pipe function', () => {
    describe('when input is synchronous', () => {
      describe('when input is a failure', () => {
        it('should infer failure type', () => {
          const input = fail('error');
          const result = assertFailure(input);

          expectTypeOf(result).toEqualTypeOf<Failure<'error'>>();
        });
      });

      describe('when input is a success', () => {
        it('should cause a type error', () => {
          const input = succeed('value');

          // @ts-expect-error
          // eslint-disable-next-line @typescript-eslint/no-floating-promises
          assertFailure(input);
        });
      });
    });

    describe('when input is asynchronous (Promise)', () => {
      describe('when input is a failure', () => {
        it('should infer failure type', () => {
          const input = fail(Promise.resolve('error'));
          const result = assertFailure(input);

          expectTypeOf(result).toEqualTypeOf<Promise<Failure<string>>>();
        });
      });

      describe('when input is a success', () => {
        it('should cause a type error', () => {
          const input = succeed(Promise.resolve('value'));

          // @ts-expect-error
          // eslint-disable-next-line @typescript-eslint/no-floating-promises
          assertFailure(input);
        });
      });
    });
  });

  describe('when used wit the pipe function', () => {
    describe('when input is synchronous', () => {
      describe('when input is a failure', () => {
        it('should infer failure type', () => {
          const result = pipe(
            fail('error'),
            assertFailure,
          );

          expectTypeOf(result).toEqualTypeOf<Failure<'error'>>();
        });
      });

      describe('when input is a success', () => {
        it('should cause a type error', () => {
          pipe(
            succeed('value'),
            // @ts-expect-error
            assertFailure,
          );
        });
      });
    });

    describe('when input is asynchronous (Promise)', () => {
      describe('when input is a failure', () => {
        it('should infer failure type', () => {
          const result = pipe(
            fail(Promise.resolve('error')),
            assertFailure,
          );

          expectTypeOf(result).toEqualTypeOf<Promise<Failure<string>>>();
        });
      });

      describe('when input is a success', () => {
        it('should cause a type error', () => {
          pipe(
            succeed(Promise.resolve('value')),
            // @ts-expect-error
            assertFailure,
          );
        });
      });
    });
  });
});
