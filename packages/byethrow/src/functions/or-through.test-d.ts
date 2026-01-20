import { describe, expectTypeOf, it } from 'vitest';

import { fail } from './fail';
import { orThrough } from './or-through';
import { pipe } from './pipe';
import { succeed } from './succeed';

import type { Result, ResultAsync } from '../result';

describe('orThrough', () => {
  describe('when used without the pipe function', () => {
    describe('when input is synchronous', () => {
      describe('when output is synchronous', () => {
        describe('when output is a success', () => {
          // eslint-disable-next-line unicorn/consistent-function-scoping
          const transform = (error: string) => succeed(error.toUpperCase());

          describe('when input is a success', () => {
            const input = succeed(2);

            it('should return the same success type', () => {
              const result = orThrough(transform)(input);

              expectTypeOf(result).toEqualTypeOf<Result<2, never>>();
            });
          });

          describe('when input is a failure', () => {
            const input = fail('error');

            it('should return original error when function returns success', () => {
              const result = orThrough(transform)(input);

              expectTypeOf(result).toEqualTypeOf<Result<never, 'error'>>();
            });
          });
        });

        describe('when output is a failure', () => {
          // eslint-disable-next-line unicorn/consistent-function-scoping
          const transform = (error: string) => fail(error.toUpperCase());

          describe('when input is a success', () => {
            const input = succeed(2);

            it('should return the same success type', () => {
              const result = orThrough(transform)(input);

              expectTypeOf(result).toEqualTypeOf<Result<2, string>>();
            });
          });

          describe('when input is a failure', () => {
            const input = fail('error');

            it('should return original error when function returns success', () => {
              const result = orThrough(transform)(input);

              expectTypeOf(result).toEqualTypeOf<Result<never, string>>();
            });
          });
        });
      });

      describe('when output is asynchronous (Promise)', () => {
        describe('when output is a success', () => {
          // eslint-disable-next-line unicorn/consistent-function-scoping
          const transform = (error: string) => succeed(Promise.resolve(error.toUpperCase()));

          describe('when input is a success', () => {
            const input = succeed(2);

            it('should return a ResultAsync with original value', () => {
              const result = orThrough(transform)(input);

              expectTypeOf(result).toEqualTypeOf<ResultAsync<2, never>>();
            });
          });

          describe('when input is a failure', () => {
            const input = fail('error');

            it('should return a ResultAsync with original error when function returns success', () => {
              const result = orThrough(transform)(input);

              expectTypeOf(result).toEqualTypeOf<ResultAsync<never, 'error'>>();
            });
          });
        });

        describe('when output is a failure', () => {
          // eslint-disable-next-line unicorn/consistent-function-scoping
          const transform = (error: string) => fail(Promise.resolve(error.toUpperCase()));

          describe('when input is a success', () => {
            const input = succeed(2);

            it('should return a ResultAsync with original value', () => {
              const result = orThrough(transform)(input);

              expectTypeOf(result).toEqualTypeOf<ResultAsync<2, string>>();
            });
          });

          describe('when input is a failure', () => {
            const input = fail('error');

            it('should return a ResultAsync with original error when function returns success', () => {
              const result = orThrough(transform)(input);

              expectTypeOf(result).toEqualTypeOf<ResultAsync<never, string>>();
            });
          });
        });
      });
    });

    describe('when input is asynchronous (Promise)', () => {
      describe('when output is synchronous', () => {
        describe('when output is a success', () => {
          // eslint-disable-next-line unicorn/consistent-function-scoping
          const transform = (error: string) => succeed(error.toUpperCase());

          describe('when input is a success', () => {
            const input = succeed(Promise.resolve(2));

            it('should return a ResultAsync with original value', () => {
              const result = orThrough(transform)(input);

              expectTypeOf(result).toEqualTypeOf<ResultAsync<number, never>>();
            });
          });

          describe('when input is a failure', () => {
            const input = fail(Promise.resolve('error'));

            it('should return a ResultAsync with original error when function returns success', () => {
              const result = orThrough(transform)(input);

              expectTypeOf(result).toEqualTypeOf<ResultAsync<never, string>>();
            });
          });
        });

        describe('when output is a failure', () => {
          // eslint-disable-next-line unicorn/consistent-function-scoping
          const transform = (error: string) => fail(error.toUpperCase());

          describe('when input is a success', () => {
            const input = succeed(Promise.resolve(2));

            it('should return a ResultAsync with original value', () => {
              const result = orThrough(transform)(input);

              expectTypeOf(result).toEqualTypeOf<ResultAsync<number, string>>();
            });
          });

          describe('when input is a failure', () => {
            const input = fail(Promise.resolve('error'));

            it('should return a ResultAsync with original error when function returns success', () => {
              const result = orThrough(transform)(input);

              expectTypeOf(result).toEqualTypeOf<ResultAsync<never, string>>();
            });
          });
        });
      });

      describe('when output is asynchronous (Promise)', () => {
        describe('when output is a success', () => {
          // eslint-disable-next-line unicorn/consistent-function-scoping
          const transform = (error: string) => succeed(Promise.resolve(error.toUpperCase()));

          describe('when input is a success', () => {
            const input = succeed(Promise.resolve(2));

            it('should return a ResultAsync with original value', () => {
              const result = orThrough(transform)(input);

              expectTypeOf(result).toEqualTypeOf<ResultAsync<number, never>>();
            });
          });

          describe('when input is a failure', () => {
            const input = fail(Promise.resolve('error'));

            it('should return a ResultAsync with original error when function returns success', () => {
              const result = orThrough(transform)(input);

              expectTypeOf(result).toEqualTypeOf<ResultAsync<never, string>>();
            });
          });
        });

        describe('when output is a failure', () => {
          // eslint-disable-next-line unicorn/consistent-function-scoping
          const transform = (error: string) => fail(Promise.resolve(error.toUpperCase()));

          describe('when input is a success', () => {
            const input = succeed(Promise.resolve(2));

            it('should return a ResultAsync with original value', () => {
              const result = orThrough(transform)(input);

              expectTypeOf(result).toEqualTypeOf<ResultAsync<number, string>>();
            });
          });

          describe('when input is a failure', () => {
            const input = fail(Promise.resolve('error'));

            it('should return a ResultAsync with original error when function returns success', () => {
              const result = orThrough(transform)(input);

              expectTypeOf(result).toEqualTypeOf<ResultAsync<never, string>>();
            });
          });
        });
      });
    });
  });

  describe('when used with the pipe function', () => {
    describe('when input is synchronous', () => {
      describe('when output is synchronous', () => {
        describe('when output is a success', () => {
          describe('when input is a success', () => {
            const input = succeed(2);

            it('should return a Result with original value', () => {
              const result = pipe(
                input,
                orThrough((error: string) => succeed(error.length)),
              );

              expectTypeOf(result).toEqualTypeOf<Result<2, never>>();
            });
          });

          describe('when input is a failure', () => {
            const input: Result<number, string> = fail('error');

            it('should return a Result with original error when function returns success', () => {
              const result = pipe(
                input,
                orThrough((error) => succeed(error.toUpperCase())),
              );

              expectTypeOf(result).toEqualTypeOf<Result<number, string>>();
            });
          });
        });

        describe('when output is a failure', () => {
          describe('when input is a success', () => {
            const input = succeed(2);

            it('should return a Result with original value', () => {
              const result = pipe(
                input,
                orThrough((error: string) => fail(error.length)),
              );

              expectTypeOf(result).toEqualTypeOf<Result<2, number>>();
            });
          });

          describe('when input is a failure', () => {
            const input: Result<number, string> = fail('error');

            it('should return a Result with original error when function returns success', () => {
              const result = pipe(
                input,
                orThrough((error) => fail(error.toUpperCase())),
              );

              expectTypeOf(result).toEqualTypeOf<Result<number, string>>();
            });
          });
        });
      });

      describe('when output is asynchronous (Promise)', () => {
        describe('when output is a success', () => {
          describe('when input is a success', () => {
            const input = succeed(2);

            it('should return a ResultAsync with original value', () => {
              const result = pipe(
                input,
                orThrough((error: string) => succeed(Promise.resolve(error.length))),
              );

              expectTypeOf(result).toEqualTypeOf<ResultAsync<2, never>>();
            });
          });

          describe('when input is a failure', () => {
            const input: Result<number, string> = fail('error');

            it('should return a ResultAsync with original error when function returns success', () => {
              const result = pipe(
                input,
                orThrough((error) => succeed(Promise.resolve(error.toUpperCase()))),
              );

              expectTypeOf(result).toEqualTypeOf<ResultAsync<number, string>>();
            });
          });
        });

        describe('when output is a failure', () => {
          describe('when input is a success', () => {
            const input = succeed(2);

            it('should return a ResultAsync with original value', () => {
              const result = pipe(
                input,
                orThrough((error: string) => fail(Promise.resolve(error.length))),
              );

              expectTypeOf(result).toEqualTypeOf<ResultAsync<2, number>>();
            });
          });

          describe('when input is a failure', () => {
            const input: Result<number, string> = fail('error');

            it('should return a ResultAsync with original error when function returns success', () => {
              const result = pipe(
                input,
                orThrough((error) => fail(Promise.resolve(error.toUpperCase()))),
              );

              expectTypeOf(result).toEqualTypeOf<ResultAsync<number, string>>();
            });
          });
        });
      });
    });

    describe('when input is asynchronous (Promise)', () => {
      describe('when output is synchronous', () => {
        describe('when output is a success', () => {
          describe('when input is a success', () => {
            const input = succeed(Promise.resolve(2));

            it('should return a ResultAsync with original value', () => {
              const result = pipe(
                input,
                orThrough((error: string) => succeed(error.length)),
              );

              expectTypeOf(result).toEqualTypeOf<ResultAsync<number, never>>();
            });
          });

          describe('when input is a failure', () => {
            const input: ResultAsync<number, string> = fail(Promise.resolve('error'));

            it('should return a ResultAsync with original error when function returns success', () => {
              const result = pipe(
                input,
                orThrough((error) => succeed(error.toUpperCase())),
              );

              expectTypeOf(result).toEqualTypeOf<ResultAsync<number, string>>();
            });
          });
        });

        describe('when output is a failure', () => {
          describe('when input is a success', () => {
            const input = succeed(Promise.resolve(2));

            it('should return a ResultAsync with original value', () => {
              const result = pipe(
                input,
                orThrough((error: string) => fail(error.length)),
              );

              expectTypeOf(result).toEqualTypeOf<ResultAsync<number, number>>();
            });
          });

          describe('when input is a failure', () => {
            const input: ResultAsync<number, string> = fail(Promise.resolve('error'));

            it('should return a ResultAsync with original error when function returns success', () => {
              const result = pipe(
                input,
                orThrough((error) => fail(error.toUpperCase())),
              );

              expectTypeOf(result).toEqualTypeOf<ResultAsync<number, string>>();
            });
          });
        });
      });

      describe('when output is asynchronous (Promise)', () => {
        describe('when output is a success', () => {
          describe('when input is a success', () => {
            const input = succeed(Promise.resolve(2));

            it('should return a ResultAsync with original value', () => {
              const result = pipe(
                input,
                orThrough((error: string) => succeed(Promise.resolve(error.length))),
              );

              expectTypeOf(result).toEqualTypeOf<ResultAsync<number, never>>();
            });
          });

          describe('when input is a failure', () => {
            const input: ResultAsync<number, string> = fail(Promise.resolve('error'));

            it('should return a ResultAsync with original error when function returns success', () => {
              const result = pipe(
                input,
                orThrough((error) => succeed(Promise.resolve(error.toUpperCase()))),
              );

              expectTypeOf(result).toEqualTypeOf<ResultAsync<number, string>>();
            });
          });
        });

        describe('when output is a failure', () => {
          describe('when input is a success', () => {
            const input = succeed(Promise.resolve(2));

            it('should return a ResultAsync with original value', () => {
              const result = pipe(
                input,
                orThrough((error: string) => fail(Promise.resolve(error.length))),
              );

              expectTypeOf(result).toEqualTypeOf<ResultAsync<number, number>>();
            });
          });

          describe('when input is a failure', () => {
            const input: ResultAsync<number, string> = fail(Promise.resolve('error'));

            it('should return a ResultAsync with original error when function returns success', () => {
              const result = pipe(
                input,
                orThrough((error) => fail(Promise.resolve(error.toUpperCase()))),
              );

              expectTypeOf(result).toEqualTypeOf<ResultAsync<number, string>>();
            });
          });
        });
      });
    });
  });
});
