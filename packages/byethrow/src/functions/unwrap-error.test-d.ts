import { describe, expectTypeOf, it } from 'vitest';

import { fail } from './fail';
import { pipe } from './pipe';
import { succeed } from './succeed';
import { unwrapError } from './unwrap-error';

describe('unwrapError', () => {
  describe('when used without the pipe function', () => {
    describe('when input is synchronous', () => {
      describe('when input is a success', () => {
        const input = succeed(42);

        it('should infer correct return type for success without default', () => {
          const value = unwrapError(input);

          expectTypeOf<never>(value);
        });

        it('should infer correct return type for success with default', () => {
          const value = unwrapError(input, 'default');

          expectTypeOf<string>(value);
        });
      });

      describe('when input is a failure', () => {
        const input = fail('error');

        it('should infer correct return type for failure without default', () => {
          const value = unwrapError(input);

          expectTypeOf<string>(value);
        });

        it('should infer correct return type for failure with default', () => {
          const value = unwrapError(input, 99);

          expectTypeOf<string | number>(value);
        });
      });
    });

    describe('when input is asynchronous (Promise)', () => {
      describe('when input is a success', () => {
        const input = succeed(Promise.resolve(42));

        it('should infer correct return type for async success without default', () => {
          const value = unwrapError(input);

          expectTypeOf<Promise<never>>(value);
        });

        it('should infer correct return type for async success with default', () => {
          const value = unwrapError(input, 'default');

          expectTypeOf<Promise<string>>(value);
        });
      });

      describe('when input is a failure', () => {
        const input = fail(Promise.resolve('error'));

        it('should infer correct return type for async failure without default', () => {
          const value = unwrapError(input);

          expectTypeOf<Promise<string>>(value);
        });

        it('should infer correct return type for async failure with default', () => {
          const value = unwrapError(input, 99);

          expectTypeOf<Promise<string | number>>(value);
        });
      });
    });
  });

  describe('when used with the pipe function', () => {
    describe('when input is synchronous', () => {
      describe('when input is a success', () => {
        const input = succeed(42);

        it('should infer correct return type for success without default', () => {
          const value = pipe(
            input,
            unwrapError(),
          );

          expectTypeOf<never>(value);
        });

        it('should infer correct return type for success with default', () => {
          const value = pipe(
            input,
            unwrapError('default'),
          );

          expectTypeOf<string>(value);
        });
      });

      describe('when input is a failure', () => {
        const input = fail('error');

        it('should infer correct return type for failure without default', () => {
          const value = pipe(
            input,
            unwrapError(),
          );

          expectTypeOf<string>(value);
        });

        it('should infer correct return type for failure with default', () => {
          const value = pipe(
            input,
            unwrapError(99),
          );

          expectTypeOf<string | number>(value);
        });
      });
    });

    describe('when input is asynchronous (Promise)', () => {
      describe('when input is a success', () => {
        const input = succeed(Promise.resolve(42));

        it('should infer correct return type for async success without default', () => {
          const value = pipe(
            input,
            unwrapError(),
          );

          expectTypeOf<Promise<never>>(value);
        });

        it('should infer correct return type for async success with default', () => {
          const value = pipe(
            input,
            unwrapError('default'),
          );

          expectTypeOf<Promise<string>>(value);
        });
      });

      describe('when input is a failure', () => {
        const input = fail(Promise.resolve('error'));

        it('should infer correct return type for async failure without default', () => {
          const value = pipe(
            input,
            unwrapError(),
          );

          expectTypeOf<Promise<string>>(value);
        });

        it('should infer correct return type for async failure with default', () => {
          const value = pipe(
            input,
            unwrapError(99),
          );

          expectTypeOf<Promise<string | number>>(value);
        });
      });
    });
  });
});
