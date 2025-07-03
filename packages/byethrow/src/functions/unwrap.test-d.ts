import { describe, expectTypeOf, it } from 'vitest';

import { fail } from './fail';
import { pipe } from './pipe';
import { succeed } from './succeed';
import { unwrap } from './unwrap';

describe('unwrap', () => {
  describe('when used without the pipe function', () => {
    describe('when input is synchronous', () => {
      describe('when input is a success', () => {
        const input = succeed(42);

        it('should infer correct return type for success without default', () => {
          const value = unwrap(input);

          expectTypeOf<number>(value);
        });

        it('should infer correct return type for success with default', () => {
          const value = unwrap(input, 'default');

          expectTypeOf<number | string>(value);
        });
      });

      describe('when input is a failure', () => {
        const input = fail('error');

        it('should infer correct return type for failure without default', () => {
          const value = unwrap(input);

          expectTypeOf<never>(value);
        });

        it('should infer correct return type for failure with default', () => {
          const value = unwrap(input, 99);

          expectTypeOf<number>(value);
        });
      });
    });

    describe('when input is asynchronous (Promise)', () => {
      describe('when input is a success', () => {
        const input = succeed(Promise.resolve(42));

        it('should infer correct return type for async success without default', () => {
          const value = unwrap(input);

          expectTypeOf<Promise<number>>(value);
        });

        it('should infer correct return type for async success with default', () => {
          const value = unwrap(input, 'default');

          expectTypeOf<Promise<number | string>>(value);
        });
      });

      describe('when input is a failure', () => {
        const input = fail(Promise.resolve('error'));

        it('should infer correct return type for async failure without default', () => {
          const value = unwrap(input);

          expectTypeOf<Promise<never>>(value);
        });

        it('should infer correct return type for async failure with default', () => {
          const value = unwrap(input, 99);

          expectTypeOf<Promise<number>>(value);
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
            unwrap(),
          );

          expectTypeOf<number>(value);
        });

        it('should infer correct return type for success with default', () => {
          const value = pipe(
            input,
            unwrap('default'),
          );

          expectTypeOf<number | string>(value);
        });
      });

      describe('when input is a failure', () => {
        const input = fail('error');

        it('should infer correct return type for failure without default', () => {
          const value = pipe(
            input,
            unwrap(),
          );

          expectTypeOf<never>(value);
        });

        it('should infer correct return type for failure with default', () => {
          const value = pipe(
            input,
            unwrap(99),
          );

          expectTypeOf<number>(value);
        });
      });
    });

    describe('when input is asynchronous (Promise)', () => {
      describe('when input is a success', () => {
        const input = succeed(Promise.resolve(42));

        it('should infer correct return type for async success without default', () => {
          const value = pipe(
            input,
            unwrap(),
          );

          expectTypeOf<Promise<number>>(value);
        });

        it('should infer correct return type for async success with default', () => {
          const value = pipe(
            input,
            unwrap('default'),
          );

          expectTypeOf<Promise<number | string>>(value);
        });
      });

      describe('when input is a failure', () => {
        const input = fail(Promise.resolve('error'));

        it('should infer correct return type for async failure without default', () => {
          const value = pipe(
            input,
            unwrap(),
          );

          expectTypeOf<Promise<never>>(value);
        });

        it('should infer correct return type for async failure with default', () => {
          const value = pipe(
            input,
            unwrap(99),
          );

          expectTypeOf<Promise<number>>(value);
        });
      });
    });
  });
});
