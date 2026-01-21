import { describe, expectTypeOf, it } from 'vitest';

import { assertSuccess } from './assert-success';
import { fail } from './fail';
import { pipe } from './pipe';
import { succeed } from './succeed';

import type { Success } from '../result';

describe('assertSuccess', () => {
  describe('when used without the pipe function', () => {
    describe('when input is synchronous', () => {
      describe('when input is a success', () => {
        it('should infer success type', () => {
          const input = succeed('value');
          const result = assertSuccess(input);

          expectTypeOf(result).toEqualTypeOf<Success<'value'>>();
        });
      });

      describe('when input is a failure', () => {
        it('should cause a type error', () => {
          const input = fail('error');

          // @ts-expect-error
          // eslint-disable-next-line @typescript-eslint/no-floating-promises
          assertSuccess(input);
        });
      });
    });

    describe('when input is asynchronous (Promise)', () => {
      describe('when input is a success', () => {
        it('should infer success type', () => {
          const input = succeed(Promise.resolve('value'));
          const result = assertSuccess(input);

          expectTypeOf(result).toEqualTypeOf<Promise<Success<string>>>();
        });
      });

      describe('when input is a failure', () => {
        it('should cause a type error', () => {
          const input = Promise.resolve(fail('error'));

          // @ts-expect-error
          // eslint-disable-next-line @typescript-eslint/no-floating-promises
          assertSuccess(input);
        });
      });
    });
  });

  describe('when used wit the pipe function', () => {
    describe('when input is synchronous', () => {
      describe('when input is a success', () => {
        it('should infer success type', () => {
          const result = pipe(
            succeed('value'),
            assertSuccess,
          );

          expectTypeOf(result).toEqualTypeOf<Success<'value'>>();
        });
      });

      describe('when input is a failure', () => {
        it('should cause a type error', () => {
          pipe(
            fail('error'),
            // @ts-expect-error
            assertSuccess,
          );
        });
      });
    });

    describe('when input is asynchronous (Promise)', () => {
      describe('when input is a success', () => {
        it('should infer success type', () => {
          const result = pipe(
            succeed(Promise.resolve('value')),
            assertSuccess,
          );

          expectTypeOf(result).toEqualTypeOf<Promise<Success<string>>>();
        });
      });

      describe('when input is a failure', () => {
        it('should cause a type error', () => {
          pipe(
            Promise.resolve(fail('error')),
            // @ts-expect-error
            assertSuccess,
          );
        });
      });
    });
  });
});
