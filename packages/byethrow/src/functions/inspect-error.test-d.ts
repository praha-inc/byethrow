import { describe, expectTypeOf, it } from 'vitest';

import { fail } from './fail';
import { inspectError } from './inspect-error';
import { pipe } from './pipe';
import { succeed } from './succeed';

import type { Result, ResultAsync } from '../result';

describe('inspectError', () => {
  describe('when used without the pipe function', () => {
    describe('when input is synchronous', () => {
      describe('when output is synchronous', () => {
        // eslint-disable-next-line unicorn/consistent-function-scoping
        const sideEffect = (x: string) => x;

        describe('when input is a failure', () => {
          const input = fail('error');

          it('should preserve the original result type', () => {
            const result = inspectError(sideEffect)(input);

            expectTypeOf(result).toEqualTypeOf<Result<never, 'error'>>();
          });
        });

        describe('when input is a success', () => {
          const input = succeed(42);

          it('should preserve the original result type', () => {
            const result = inspectError(sideEffect)(input);

            expectTypeOf(result).toEqualTypeOf<Result<42, never>>();
          });
        });
      });

      describe('when output is asynchronous (Promise)', () => {
        // eslint-disable-next-line unicorn/consistent-function-scoping
        const sideEffect = (x: string) => Promise.resolve(x);

        describe('when input is a failure', () => {
          const input = fail('error');

          it('should preserve the original result type', () => {
            const result = inspectError(sideEffect)(input);

            expectTypeOf(result).toEqualTypeOf<ResultAsync<never, 'error'>>();
          });
        });

        describe('when input is a success', () => {
          const input = succeed(42);

          it('should preserve the original result type', () => {
            const result = inspectError(sideEffect)(input);

            expectTypeOf(result).toEqualTypeOf<ResultAsync<42, never>>();
          });
        });
      });
    });

    describe('when input is asynchronous (Promise)', () => {
      describe('when output is synchronous', () => {
        // eslint-disable-next-line unicorn/consistent-function-scoping
        const sideEffect = (x: string) => x;

        describe('when input is a failure', () => {
          const input = fail(Promise.resolve('error'));

          it('should preserve the original result type', () => {
            const result = inspectError(sideEffect)(input);

            expectTypeOf(result).toEqualTypeOf<ResultAsync<never, string>>();
          });
        });

        describe('when input is a success', () => {
          const input = succeed(Promise.resolve(42));

          it('should preserve the original result type', () => {
            const result = inspectError(sideEffect)(input);

            expectTypeOf(result).toEqualTypeOf<ResultAsync<number, never>>();
          });
        });
      });

      describe('when output is asynchronous (Promise)', () => {
        // eslint-disable-next-line unicorn/consistent-function-scoping
        const sideEffect = (x: string) => Promise.resolve(x);

        describe('when input is a failure', () => {
          const input = fail(Promise.resolve('error'));

          it('should preserve the original result type', () => {
            const result = inspectError(sideEffect)(input);

            expectTypeOf(result).toEqualTypeOf<ResultAsync<never, string>>();
          });
        });

        describe('when input is a success', () => {
          const input = succeed(Promise.resolve(42));

          it('should preserve the original result type', () => {
            const result = inspectError(sideEffect)(input);

            expectTypeOf(result).toEqualTypeOf<ResultAsync<number, never>>();
          });
        });
      });
    });
  });

  describe('when used with the pipe function', () => {
    describe('when input is synchronous', () => {
      describe('when output is synchronous', () => {
        describe('when input is a failure', () => {
          const input = fail('error');

          it('should preserve the original result type', () => {
            const result = pipe(
              input,
              inspectError((x) => x.length),
            );

            expectTypeOf(result).toEqualTypeOf<Result<never, 'error'>>();
          });
        });

        describe('when input is a success', () => {
          const input = succeed(42);

          it('should preserve the original result type', () => {
            const result = pipe(
              input,
              inspectError((x: string) => x.length),
            );

            expectTypeOf(result).toEqualTypeOf<Result<42, never>>();
          });
        });
      });

      describe('when output is asynchronous (Promise)', () => {
        describe('when input is a failure', () => {
          const input = fail('error');

          it('should preserve the original result type', () => {
            const result = pipe(
              input,
              inspectError((x) => Promise.resolve(x.length)),
            );

            expectTypeOf(result).toEqualTypeOf<ResultAsync<never, 'error'>>();
          });
        });

        describe('when input is a success', () => {
          const input = succeed(42);

          it('should preserve the original result type', () => {
            const result = pipe(
              input,
              inspectError((x: string) => Promise.resolve(x.length)),
            );

            expectTypeOf(result).toEqualTypeOf<ResultAsync<42, never>>();
          });
        });
      });
    });

    describe('when input is asynchronous (Promise)', () => {
      describe('when output is synchronous', () => {
        describe('when input is a failure', () => {
          const input = fail(Promise.resolve('error'));

          it('should preserve the original result type', () => {
            const result = pipe(
              input,
              inspectError((x) => x.length),
            );

            expectTypeOf(result).toEqualTypeOf<ResultAsync<never, string>>();
          });
        });

        describe('when input is a success', () => {
          const input = succeed(Promise.resolve(42));

          it('should preserve the original result type', () => {
            const result = pipe(
              input,
              inspectError((x: string) => x.length),
            );

            expectTypeOf(result).toEqualTypeOf<ResultAsync<number, never>>();
          });
        });
      });

      describe('when output is asynchronous (Promise)', () => {
        describe('when input is a failure', () => {
          const input = fail(Promise.resolve('error'));

          it('should preserve the original result type', () => {
            const result = pipe(
              input,
              inspectError((x) => Promise.resolve(x.length)),
            );

            expectTypeOf(result).toEqualTypeOf<ResultAsync<never, string>>();
          });
        });

        describe('when input is a success', () => {
          const input = succeed(Promise.resolve(42));

          it('should preserve the original result type', () => {
            const result = pipe(
              input,
              inspectError((x: string) => Promise.resolve(x.length)),
            );

            expectTypeOf(result).toEqualTypeOf<ResultAsync<number, never>>();
          });
        });
      });
    });
  });
});
