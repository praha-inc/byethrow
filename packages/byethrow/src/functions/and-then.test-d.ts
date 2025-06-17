import { describe, expectTypeOf, it } from 'vitest';

import { andThen } from './and-then';
import { fail } from './fail';
import { pipe } from './pipe';
import { succeed } from './succeed';

import type { Result, ResultAsync } from '../result';

describe('andThen', () => {
  describe('when used without the pipe function', () => {
    describe('when input is synchronous', () => {
      describe('when output is synchronous', () => {
        // eslint-disable-next-line unicorn/consistent-function-scoping
        const transform = (x: number) => succeed(x.toString());

        describe('when input is a success', () => {
          const input = succeed(2);

          it('should return a Result with transformed value', () => {
            const result = andThen(transform)(input);

            expectTypeOf(result).toEqualTypeOf<Result<string, never>>();
          });
        });

        describe('when input is a failure', () => {
          const input = fail('error');

          it('should return a Result with original error', () => {
            const result = andThen(transform)(input);

            expectTypeOf(result).toEqualTypeOf<Result<string, string>>();
          });
        });
      });

      describe('when output is asynchronous (Promise)', () => {
        // eslint-disable-next-line unicorn/consistent-function-scoping
        const transform = (x: number) => succeed(Promise.resolve(x.toString()));

        describe('when input is a success', () => {
          const input = succeed(2);

          it('should return a ResultAsync with transformed value', () => {
            const result = andThen(transform)(input);

            expectTypeOf(result).toEqualTypeOf<ResultAsync<string, never>>();
          });
        });

        describe('when input is a failure', () => {
          const input = fail('error');

          it('should return a ResultAsync with original error', () => {
            const result = andThen(transform)(input);

            expectTypeOf(result).toEqualTypeOf<ResultAsync<string, string>>();
          });
        });
      });
    });

    describe('when input is asynchronous (Promise)', () => {
      describe('when output is synchronous', () => {
        // eslint-disable-next-line unicorn/consistent-function-scoping
        const transform = (x: number) => succeed(x.toString());

        describe('when input is a success', () => {
          const input = succeed(Promise.resolve(2));

          it('should return a ResultAsync with transformed value', () => {
            const result = andThen(transform)(input);

            expectTypeOf(result).toEqualTypeOf<ResultAsync<string, never>>();
          });
        });

        describe('when input is a failure', () => {
          const input = fail(Promise.resolve('error'));

          it('should return a ResultAsync with original error', () => {
            const result = andThen(transform)(input);

            expectTypeOf(result).toEqualTypeOf<ResultAsync<string, string>>();
          });
        });
      });

      describe('when output is asynchronous (Promise)', () => {
        // eslint-disable-next-line unicorn/consistent-function-scoping
        const transform = (x: number) => succeed(Promise.resolve(x.toString()));

        describe('when input is a success', () => {
          const input = succeed(Promise.resolve(2));

          it('should return a ResultAsync with transformed value', () => {
            const result = andThen(transform)(input);

            expectTypeOf(result).toEqualTypeOf<ResultAsync<string, never>>();
          });
        });

        describe('when input is a failure', () => {
          const input = fail(Promise.resolve('error'));

          it('should return a ResultAsync with original error', () => {
            const result = andThen(transform)(input);

            expectTypeOf(result).toEqualTypeOf<ResultAsync<string, string>>();
          });
        });
      });
    });
  });

  describe('when used wit the pipe function', () => {
    describe('when input is synchronous', () => {
      describe('when output is synchronous', () => {
        describe('when input is a success', () => {
          const input = succeed(2);

          it('should return a Result with transformed value', () => {
            const result = pipe(
              input,
              andThen((x) => succeed(x.toString())),
            );

            expectTypeOf(result).toEqualTypeOf<Result<string, never>>();
          });
        });

        describe('when input is a failure', () => {
          const input: Result<number, string> = fail('error');

          it('should return a Result with original error', () => {
            const result = pipe(
              input,
              andThen((x) => succeed(x.toString())),
            );

            expectTypeOf(result).toEqualTypeOf<Result<string, string>>();
          });
        });
      });

      describe('when output is asynchronous (Promise)', () => {
        describe('when input is a success', () => {
          const input = succeed(2);

          it('should return a ResultAsync with transformed value', () => {
            const result = pipe(
              input,
              andThen((x) => succeed(Promise.resolve(x.toString()))),
            );

            expectTypeOf(result).toEqualTypeOf<ResultAsync<string, never>>();
          });
        });

        describe('when input is a failure', () => {
          const input: Result<number, string> = fail('error');

          it('should return a ResultAsync with original error', () => {
            const result = pipe(
              input,
              andThen((x) => succeed(Promise.resolve(x.toString()))),
            );

            expectTypeOf(result).toEqualTypeOf<ResultAsync<string, string>>();
          });
        });
      });
    });

    describe('when input is asynchronous (Promise)', () => {
      describe('when output is synchronous', () => {
        describe('when input is a success', () => {
          const input = succeed(Promise.resolve(2));

          it('should return a ResultAsync with transformed value', () => {
            const result = pipe(
              input,
              andThen((x) => succeed(x.toString())),
            );

            expectTypeOf(result).toEqualTypeOf<ResultAsync<string, never>>();
          });
        });

        describe('when input is a failure', () => {
          const input: ResultAsync<number, string> = fail(Promise.resolve('error'));

          it('should return a ResultAsync with original error', () => {
            const result = pipe(
              input,
              andThen((x) => succeed(x.toString())),
            );

            expectTypeOf(result).toEqualTypeOf<ResultAsync<string, string>>();
          });
        });
      });

      describe('when output is asynchronous (Promise)', () => {
        describe('when input is a success', () => {
          const input = succeed(Promise.resolve(2));

          it('should return a ResultAsync with transformed value', () => {
            const result = pipe(
              input,
              andThen((x) => succeed(Promise.resolve(x.toString()))),
            );

            expectTypeOf(result).toEqualTypeOf<ResultAsync<string, never>>();
          });
        });

        describe('when input is a failure', () => {
          const input: ResultAsync<number, string> = fail(Promise.resolve('error'));

          it('should return a ResultAsync with original error', () => {
            const result = pipe(
              input,
              andThen((x) => succeed(Promise.resolve(x.toString()))),
            );

            expectTypeOf(result).toEqualTypeOf<ResultAsync<string, string>>();
          });
        });
      });
    });
  });
});
