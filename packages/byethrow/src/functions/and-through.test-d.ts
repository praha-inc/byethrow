import { describe, expectTypeOf, it } from 'vitest';

import { andThrough } from './and-through';
import { fail } from './fail';
import { pipe } from './pipe';
import { succeed } from './succeed';

import type { Result, ResultAsync } from '../result';

describe('andThrough', () => {
  describe('when used without the pipe function', () => {
    describe('when input is synchronous', () => {
      describe('when output is synchronous', () => {
        // eslint-disable-next-line unicorn/consistent-function-scoping
        const transform = (x: number) => succeed(x.toString());

        describe('when input is a success', () => {
          const input = succeed(2);

          it('should return a Result with original value', () => {
            const result = andThrough(transform)(input);

            expectTypeOf(result).toEqualTypeOf<Result<number, never>>();
          });
        });

        describe('when input is a failure', () => {
          const input = fail('error');

          it('should return a Result with original error', () => {
            const result = andThrough(transform)(input);

            expectTypeOf(result).toEqualTypeOf<Result<never, string>>();
          });
        });
      });

      describe('when output is asynchronous (Promise)', () => {
        // eslint-disable-next-line unicorn/consistent-function-scoping
        const transform = (x: number) => succeed(Promise.resolve(x.toString()));

        describe('when input is a success', () => {
          const input = succeed(2);

          it('should return a ResultAsync with original value', () => {
            const result = andThrough(transform)(input);

            expectTypeOf(result).toEqualTypeOf<ResultAsync<number, never>>();
          });
        });

        describe('when input is a failure', () => {
          const input = fail('error');

          it('should return a ResultAsync with original error', () => {
            const result = andThrough(transform)(input);

            expectTypeOf(result).toEqualTypeOf<ResultAsync<never, string>>();
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

          it('should return a ResultAsync with original value', () => {
            const result = andThrough(transform)(input);

            expectTypeOf(result).toEqualTypeOf<ResultAsync<number, never>>();
          });
        });

        describe('when input is a failure', () => {
          const input = fail(Promise.resolve('error'));

          it('should return a ResultAsync with original error', () => {
            const result = andThrough(transform)(input);

            expectTypeOf(result).toEqualTypeOf<ResultAsync<never, string>>();
          });
        });
      });

      describe('when output is asynchronous (Promise)', () => {
        // eslint-disable-next-line unicorn/consistent-function-scoping
        const transform = (x: number) => succeed(Promise.resolve(x.toString()));

        describe('when input is a success', () => {
          const input = succeed(Promise.resolve(2));

          it('should return a ResultAsync with original value', () => {
            const result = andThrough(transform)(input);

            expectTypeOf(result).toEqualTypeOf<ResultAsync<number, never>>();
          });
        });

        describe('when input is a failure', () => {
          const input = fail(Promise.resolve('error'));

          it('should return a ResultAsync with original error', () => {
            const result = andThrough(transform)(input);

            expectTypeOf(result).toEqualTypeOf<ResultAsync<never, string>>();
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

          it('should return a Result with original value', () => {
            const result = pipe(
              input,
              andThrough((x) => succeed(x.toString())),
            );

            expectTypeOf(result).toEqualTypeOf<Result<number, never>>();
          });
        });

        describe('when input is a failure', () => {
          const input: Result<number, string> = fail('error');

          it('should return a Result with original error', () => {
            const result = pipe(
              input,
              andThrough((x) => succeed(x.toString())),
            );

            expectTypeOf(result).toEqualTypeOf<Result<number, string>>();
          });
        });
      });

      describe('when output is asynchronous (Promise)', () => {
        describe('when input is a success', () => {
          const input = succeed(2);

          it('should return a ResultAsync with original value', () => {
            const result = pipe(
              input,
              andThrough((x) => succeed(Promise.resolve(x.toString()))),
            );

            expectTypeOf(result).toEqualTypeOf<ResultAsync<number, never>>();
          });
        });

        describe('when input is a failure', () => {
          const input: Result<number, string> = fail('error');

          it('should return a ResultAsync with original error', () => {
            const result = pipe(
              input,
              andThrough((x) => succeed(Promise.resolve(x.toString()))),
            );

            expectTypeOf(result).toEqualTypeOf<ResultAsync<number, string>>();
          });
        });
      });
    });

    describe('when input is asynchronous (Promise)', () => {
      describe('when output is synchronous', () => {
        describe('when input is a success', () => {
          const input = succeed(Promise.resolve(2));

          it('should return a ResultAsync with original value', () => {
            const result = pipe(
              input,
              andThrough((x) => succeed(x.toString())),
            );

            expectTypeOf(result).toEqualTypeOf<ResultAsync<number, never>>();
          });
        });

        describe('when input is a failure', () => {
          const input: ResultAsync<number, string> = fail(Promise.resolve('error'));

          it('should return a ResultAsync with original error', () => {
            const result = pipe(
              input,
              andThrough((x) => succeed(x.toString())),
            );

            expectTypeOf(result).toEqualTypeOf<ResultAsync<number, string>>();
          });
        });
      });

      describe('when output is asynchronous (Promise)', () => {
        describe('when input is a success', () => {
          const input = succeed(Promise.resolve(2));

          it('should return a ResultAsync with original value', () => {
            const result = pipe(
              input,
              andThrough((x) => succeed(Promise.resolve(x.toString()))),
            );

            expectTypeOf(result).toEqualTypeOf<ResultAsync<number, never>>();
          });
        });

        describe('when input is a failure', () => {
          const input: ResultAsync<number, string> = fail(Promise.resolve('error'));

          it('should return a ResultAsync with original error', () => {
            const result = pipe(
              input,
              andThrough((x) => succeed(Promise.resolve(x.toString()))),
            );

            expectTypeOf(result).toEqualTypeOf<ResultAsync<number, string>>();
          });
        });
      });
    });
  });
});
