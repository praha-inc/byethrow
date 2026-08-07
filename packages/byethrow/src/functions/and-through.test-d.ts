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
        describe('when output is a success', () => {
          const transform = (x: number) => succeed(x.toString());

          describe('when input is a success', () => {
            const input = succeed(2);

            it('should return a Result with original value', () => {
              const result = andThrough(transform)(input);

              expectTypeOf(result).toEqualTypeOf<Result<2, never>>();
            });
          });

          describe('when input is a failure', () => {
            const input = fail('error');

            it('should return a Result with original error', () => {
              const result = andThrough(transform)(input);

              expectTypeOf(result).toEqualTypeOf<Result<never, 'error'>>();
            });
          });
        });

        describe('when output is a failure', () => {
          const transform = (x: number) => fail(x.toString());

          describe('when input is a success', () => {
            const input = succeed(2);

            it('should return a Result with original value', () => {
              const result = andThrough(transform)(input);

              expectTypeOf(result).toEqualTypeOf<Result<2, string>>();
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
      });

      describe('when output is asynchronous (Promise)', () => {
        describe('when output is a success', () => {
          const transform = (x: number) => Promise.resolve(succeed(x.toString()));

          describe('when input is a success', () => {
            const input = succeed(2);

            it('should return a ResultAsync with original value', () => {
              const result = andThrough(transform)(input);

              expectTypeOf(result).toEqualTypeOf<ResultAsync<2, never>>();
            });
          });

          describe('when input is a failure', () => {
            const input = fail('error');

            it('should return a ResultAsync with original error', () => {
              const result = andThrough(transform)(input);

              expectTypeOf(result).toEqualTypeOf<ResultAsync<never, 'error'>>();
            });
          });
        });

        describe('when output is a failure', () => {
          const transform = (x: number) => Promise.resolve(fail(x.toString()));

          describe('when input is a success', () => {
            const input = succeed(2);

            it('should return a ResultAsync with original value', () => {
              const result = andThrough(transform)(input);

              expectTypeOf(result).toEqualTypeOf<ResultAsync<2, string>>();
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
    });

    describe('when input is asynchronous (Promise)', () => {
      describe('when output is synchronous', () => {
        describe('when output is a success', () => {
          const transform = (x: number) => succeed(x.toString());

          describe('when input is a success', () => {
            const value: number = 2;
            const input = Promise.resolve(succeed(value));

            it('should return a ResultAsync with original value', () => {
              const result = andThrough(transform)(input);

              expectTypeOf(result).toEqualTypeOf<ResultAsync<number, never>>();
            });
          });

          describe('when input is a failure', () => {
            const error: string = 'error';
            const input = Promise.resolve(fail(error));

            it('should return a ResultAsync with original error', () => {
              const result = andThrough(transform)(input);

              expectTypeOf(result).toEqualTypeOf<ResultAsync<never, string>>();
            });
          });
        });

        describe('when output is a failure', () => {
          const transform = (x: number) => fail(x.toString());

          describe('when input is a success', () => {
            const value: number = 2;
            const input = Promise.resolve(succeed(value));

            it('should return a ResultAsync with original value', () => {
              const result = andThrough(transform)(input);

              expectTypeOf(result).toEqualTypeOf<ResultAsync<number, string>>();
            });
          });

          describe('when input is a failure', () => {
            const error: string = 'error';
            const input = Promise.resolve(fail(error));

            it('should return a ResultAsync with original error', () => {
              const result = andThrough(transform)(input);

              expectTypeOf(result).toEqualTypeOf<ResultAsync<never, string>>();
            });
          });
        });
      });

      describe('when output is asynchronous (Promise)', () => {
        describe('when output is a success', () => {
          const transform = (x: number) => Promise.resolve(succeed(x.toString()));

          describe('when input is a success', () => {
            const value: number = 2;
            const input = Promise.resolve(succeed(value));

            it('should return a ResultAsync with original value', () => {
              const result = andThrough(transform)(input);

              expectTypeOf(result).toEqualTypeOf<ResultAsync<number, never>>();
            });
          });

          describe('when input is a failure', () => {
            const error: string = 'error';
            const input = Promise.resolve(fail(error));

            it('should return a ResultAsync with original error', () => {
              const result = andThrough(transform)(input);

              expectTypeOf(result).toEqualTypeOf<ResultAsync<never, string>>();
            });
          });
        });

        describe('when output is a failure', () => {
          const transform = (x: number) => Promise.resolve(fail(x.toString()));

          describe('when input is a success', () => {
            const value: number = 2;
            const input = Promise.resolve(succeed(value));

            it('should return a ResultAsync with original value', () => {
              const result = andThrough(transform)(input);

              expectTypeOf(result).toEqualTypeOf<ResultAsync<number, string>>();
            });
          });

          describe('when input is a failure', () => {
            const error: string = 'error';
            const input = Promise.resolve(fail(error));

            it('should return a ResultAsync with original error', () => {
              const result = andThrough(transform)(input);

              expectTypeOf(result).toEqualTypeOf<ResultAsync<never, string>>();
            });
          });
        });
      });
    });
  });

  describe('when used wit the pipe function', () => {
    describe('when input is synchronous', () => {
      describe('when output is synchronous', () => {
        describe('when output is a success', () => {
          describe('when input is a success', () => {
            const input = succeed(2);

            it('should return a Result with original value', () => {
              const result = pipe(
                input,
                andThrough((x) => succeed(x.toString())),
              );

              expectTypeOf(result).toEqualTypeOf<Result<2, never>>();
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

        describe('when output is a failure', () => {
          describe('when input is a success', () => {
            const input = succeed(2);

            it('should return a Result with original value', () => {
              const result = pipe(
                input,
                andThrough((x) => fail(x.toString())),
              );

              expectTypeOf(result).toEqualTypeOf<Result<2, string>>();
            });
          });

          describe('when input is a failure', () => {
            const input: Result<number, string> = fail('error');

            it('should return a Result with original error', () => {
              const result = pipe(
                input,
                andThrough((x) => fail(x.toString())),
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
                andThrough((x) => Promise.resolve(succeed(x.toString()))),
              );

              expectTypeOf(result).toEqualTypeOf<ResultAsync<2, never>>();
            });
          });

          describe('when input is a failure', () => {
            const input: Result<number, string> = fail('error');

            it('should return a ResultAsync with original error', () => {
              const result = pipe(
                input,
                andThrough((x) => Promise.resolve(succeed(x.toString()))),
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
                andThrough((x) => Promise.resolve(fail(x.toString()))),
              );

              expectTypeOf(result).toEqualTypeOf<ResultAsync<2, string>>();
            });
          });

          describe('when input is a failure', () => {
            const input: Result<number, string> = fail('error');

            it('should return a ResultAsync with original error', () => {
              const result = pipe(
                input,
                andThrough((x) => Promise.resolve(fail(x.toString()))),
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
            const value: number = 2;
            const input = Promise.resolve(succeed(value));

            it('should return a ResultAsync with original value', () => {
              const result = pipe(
                input,
                andThrough((x) => succeed(x.toString())),
              );

              expectTypeOf(result).toEqualTypeOf<ResultAsync<number, never>>();
            });
          });

          describe('when input is a failure', () => {
            const input: ResultAsync<number, string> = Promise.resolve(fail('error'));

            it('should return a ResultAsync with original error', () => {
              const result = pipe(
                input,
                andThrough((x) => succeed(x.toString())),
              );

              expectTypeOf(result).toEqualTypeOf<ResultAsync<number, string>>();
            });
          });
        });

        describe('when output is a failure', () => {
          describe('when input is a success', () => {
            const value: number = 2;
            const input = Promise.resolve(succeed(value));

            it('should return a ResultAsync with original value', () => {
              const result = pipe(
                input,
                andThrough((x) => fail(x.toString())),
              );

              expectTypeOf(result).toEqualTypeOf<ResultAsync<number, string>>();
            });
          });

          describe('when input is a failure', () => {
            const input: ResultAsync<number, string> = Promise.resolve(fail('error'));

            it('should return a ResultAsync with original error', () => {
              const result = pipe(
                input,
                andThrough((x) => fail(x.toString())),
              );

              expectTypeOf(result).toEqualTypeOf<ResultAsync<number, string>>();
            });
          });
        });
      });

      describe('when output is asynchronous (Promise)', () => {
        describe('when output is a success', () => {
          describe('when input is a success', () => {
            const value: number = 2;
            const input = Promise.resolve(succeed(value));

            it('should return a ResultAsync with original value', () => {
              const result = pipe(
                input,
                andThrough((x) => Promise.resolve(succeed(x.toString()))),
              );

              expectTypeOf(result).toEqualTypeOf<ResultAsync<number, never>>();
            });
          });

          describe('when input is a failure', () => {
            const input: ResultAsync<number, string> = Promise.resolve(fail('error'));

            it('should return a ResultAsync with original error', () => {
              const result = pipe(
                input,
                andThrough((x) => Promise.resolve(succeed(x.toString()))),
              );

              expectTypeOf(result).toEqualTypeOf<ResultAsync<number, string>>();
            });
          });
        });

        describe('when output is a failure', () => {
          describe('when input is a success', () => {
            const value: number = 2;
            const input = Promise.resolve(succeed(value));

            it('should return a ResultAsync with original value', () => {
              const result = pipe(
                input,
                andThrough((x) => Promise.resolve(fail(x.toString()))),
              );

              expectTypeOf(result).toEqualTypeOf<ResultAsync<number, string>>();
            });
          });

          describe('when input is a failure', () => {
            const input: ResultAsync<number, string> = Promise.resolve(fail('error'));

            it('should return a ResultAsync with original error', () => {
              const result = pipe(
                input,
                andThrough((x) => Promise.resolve(fail(x.toString()))),
              );

              expectTypeOf(result).toEqualTypeOf<ResultAsync<number, string>>();
            });
          });
        });
      });
    });
  });
});
