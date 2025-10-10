import { describe, expectTypeOf, it } from 'vitest';

import { fail } from './fail';
import { inspect } from './inspect';
import { pipe } from './pipe';
import { succeed } from './succeed';

import type { Result, ResultAsync } from '../result';

describe('inspect', () => {
  describe('when used without the pipe function', () => {
    describe('when input is synchronous', () => {
      describe('when output is synchronous', () => {
        // eslint-disable-next-line unicorn/consistent-function-scoping
        const sideEffect = (x: number) => x;

        describe('when input is a success', () => {
          const input = succeed(42);

          it('should preserve the original result type', () => {
            const result = inspect(sideEffect)(input);

            expectTypeOf(result).toEqualTypeOf<Result<number, never>>();
          });
        });

        describe('when input is a failure', () => {
          const input = fail(42);

          it('should preserve the original result type', () => {
            const result = inspect(sideEffect)(input);

            expectTypeOf(result).toEqualTypeOf<Result<never, number>>();
          });
        });
      });

      describe('when output is asynchronous (Promise)', () => {
        // eslint-disable-next-line unicorn/consistent-function-scoping
        const sideEffect = (x: number) => Promise.resolve(x);

        describe('when input is a success', () => {
          const input = succeed(42);

          it('should preserve the original result type', () => {
            const result = inspect(sideEffect)(input);

            expectTypeOf(result).toEqualTypeOf<ResultAsync<number, never>>();
          });
        });

        describe('when input is a failure', () => {
          const input = fail(42);

          it('should preserve the original result type', () => {
            const result = inspect(sideEffect)(input);

            expectTypeOf(result).toEqualTypeOf<ResultAsync<never, number>>();
          });
        });
      });
    });

    describe('when input is asynchronous (Promise)', () => {
      describe('when output is synchronous', () => {
        // eslint-disable-next-line unicorn/consistent-function-scoping
        const sideEffect = (x: number) => x;

        describe('when input is a success', () => {
          const input = succeed(Promise.resolve(42));

          it('should preserve the original ResultAsync type', () => {
            const result = inspect(sideEffect)(input);

            expectTypeOf(result).toEqualTypeOf<ResultAsync<number, never>>();
          });
        });

        describe('when input is a failure', () => {
          const input = fail(Promise.resolve(42));

          it('should preserve the original ResultAsync type', () => {
            const result = inspect(sideEffect)(input);

            expectTypeOf(result).toEqualTypeOf<ResultAsync<never, number>>();
          });
        });
      });

      describe('when output is asynchronous (Promise)', () => {
        // eslint-disable-next-line unicorn/consistent-function-scoping
        const sideEffect = (x: number) => Promise.resolve(x);

        describe('when input is a success', () => {
          const input = succeed(Promise.resolve(42));

          it('should preserve the original ResultAsync type', () => {
            const result = inspect(sideEffect)(input);

            expectTypeOf(result).toEqualTypeOf<ResultAsync<number, never>>();
          });
        });

        describe('when input is a failure', () => {
          const input = fail(Promise.resolve(42));

          it('should preserve the original ResultAsync type', () => {
            const result = inspect(sideEffect)(input);

            expectTypeOf(result).toEqualTypeOf<ResultAsync<never, number>>();
          });
        });
      });
    });
  });

  describe('when used with the pipe function', () => {
    describe('when input is synchronous', () => {
      describe('when output is synchronous', () => {
        describe('when input is a success', () => {
          const input = succeed(42);

          it('should preserve the original result type', () => {
            const result = pipe(
              input,
              inspect((x) => x),
            );

            expectTypeOf(result).toEqualTypeOf<Result<number, never>>();
          });
        });

        describe('when input is a failure', () => {
          const input = fail(42);

          it('should preserve the original result type', () => {
            const result = pipe(
              input,
              inspect((x) => x),
            );

            expectTypeOf(result).toEqualTypeOf<Result<never, number>>();
          });
        });
      });

      describe('when output is asynchronous (Promise)', () => {
        describe('when input is a success', () => {
          const input = succeed(42);

          it('should preserve the original result type', () => {
            const result = pipe(
              input,
              inspect((x) => Promise.resolve(x)),
            );

            expectTypeOf(result).toEqualTypeOf<ResultAsync<number, never>>();
          });
        });

        describe('when input is a failure', () => {
          const input = fail(42);

          it('should preserve the original result type', () => {
            const result = pipe(
              input,
              inspect((x: number) => Promise.resolve(x)),
            );

            expectTypeOf(result).toEqualTypeOf<ResultAsync<never, number>>();
          });
        });
      });
    });

    describe('when input is asynchronous (Promise)', () => {
      describe('when output is synchronous', () => {
        describe('when input is a success', () => {
          const input = succeed(Promise.resolve(42));

          it('should preserve the original ResultAsync type', () => {
            const result = pipe(
              input,
              inspect((x) => x),
            );

            expectTypeOf(result).toEqualTypeOf<ResultAsync<number, never>>();
          });
        });

        describe('when input is a failure', () => {
          const input = fail(Promise.resolve(42));

          it('should preserve the original ResultAsync type', () => {
            const result = pipe(
              input,
              inspect((x) => x),
            );

            expectTypeOf(result).toEqualTypeOf<ResultAsync<never, number>>();
          });
        });
      });

      describe('when output is asynchronous (Promise)', () => {
        describe('when input is a success', () => {
          const input = succeed(Promise.resolve(42));

          it('should preserve the original ResultAsync type', () => {
            const result = pipe(
              input,
              inspect((x) => Promise.resolve(x)),
            );

            expectTypeOf(result).toEqualTypeOf<ResultAsync<number, never>>();
          });
        });

        describe('when input is a failure', () => {
          const input = fail(Promise.resolve(42));

          it('should preserve the original ResultAsync type', () => {
            const result = pipe(
              input,
              inspect((x: number) => Promise.resolve(x)),
            );

            expectTypeOf(result).toEqualTypeOf<ResultAsync<never, number>>();
          });
        });
      });
    });
  });
});
