import { describe, expectTypeOf, it } from 'vitest';

import { fail } from './fail';
import { orElse } from './or-else';
import { pipe } from './pipe';
import { succeed } from './succeed';

import type { Result, ResultAsync } from '../result';

describe('orElse', () => {
  describe('when used without the pipe function', () => {
    describe('when input is synchronous', () => {
      describe('when output is synchronous', () => {
        describe('when input is a success', () => {
          const input = succeed(42);
          const transform = (x: string) => succeed(x.toUpperCase());

          it('should return a Result with original value', () => {
            const result = orElse(transform)(input);

            expectTypeOf(result).toEqualTypeOf<Result<42 | string, never>>();
          });
        });

        describe('when input is a failure', () => {
          const input = fail('error');

          describe('when input is a success', () => {
            const transform = (x: string) => succeed(x.toUpperCase());

            it('should return a Result with transformed value', () => {
              const result = orElse(transform)(input);

              expectTypeOf(result).toEqualTypeOf<Result<string, never>>();
            });
          });

          describe('when input is a failure', () => {
            const transform = (x: string) => fail(x.toUpperCase());

            it('should return a Result with transformed value', () => {
              const result = orElse(transform)(input);

              expectTypeOf(result).toEqualTypeOf<Result<never, string>>();
            });
          });
        });
      });

      describe('when output is asynchronous (Promise)', () => {
        describe('when input is a success', () => {
          const input = succeed(42);
          const transform = (x: string) => Promise.resolve(succeed(x.toUpperCase()));

          it('should return a ResultAsync with original value', () => {
            const result = orElse(transform)(input);

            expectTypeOf(result).toEqualTypeOf<ResultAsync<42 | string, never>>();
          });
        });

        describe('when input is a failure', () => {
          const input = fail('error');

          describe('when input is a success', () => {
            const transform = (x: string) => Promise.resolve(succeed(x.toUpperCase()));

            it('should return a ResultAsync with transformed value', () => {
              const result = orElse(transform)(input);

              expectTypeOf(result).toEqualTypeOf<ResultAsync<string, never>>();
            });
          });

          describe('when input is a failure', () => {
            const transform = (x: string) => Promise.resolve(fail(x.toUpperCase()));

            it('should return a ResultAsync with transformed value', () => {
              const result = orElse(transform)(input);

              expectTypeOf(result).toEqualTypeOf<ResultAsync<never, string>>();
            });
          });
        });
      });
    });

    describe('when input is asynchronous (Promise)', () => {
      describe('when output is synchronous', () => {
        describe('when input is a success', () => {
          const value: number = 42;
          const input = Promise.resolve(succeed(value));
          const transform = (x: string) => succeed(x.toUpperCase());

          it('should return a ResultAsync with original value', () => {
            const result = orElse(transform)(input);

            expectTypeOf(result).toEqualTypeOf<ResultAsync<number | string, never>>();
          });
        });

        describe('when input is a failure', () => {
          const error: string = 'error';
          const input = Promise.resolve(fail(error));

          describe('when input is a success', () => {
            const transform = (x: string) => succeed(x.toUpperCase());

            it('should return a ResultAsync with transformed value', () => {
              const result = orElse(transform)(input);

              expectTypeOf(result).toEqualTypeOf<ResultAsync<string, never>>();
            });
          });

          describe('when input is a failure', () => {
            const transform = (x: string) => fail(x.toUpperCase());

            it('should return a ResultAsync with transformed value', () => {
              const result = orElse(transform)(input);

              expectTypeOf(result).toEqualTypeOf<ResultAsync<never, string>>();
            });
          });
        });
      });

      describe('when output is asynchronous (Promise)', () => {
        describe('when input is a success', () => {
          const value: number = 42;
          const input = Promise.resolve(succeed(value));
          const transform = (x: string) => Promise.resolve(succeed(x.toUpperCase()));

          it('should return a ResultAsync with original value', () => {
            const result = orElse(transform)(input);

            expectTypeOf(result).toEqualTypeOf<ResultAsync<number | string, never>>();
          });
        });

        describe('when input is a failure', () => {
          const error: string = 'error';
          const input = Promise.resolve(fail(error));

          describe('when input is a success', () => {
            const transform = (x: string) => Promise.resolve(succeed(x.toUpperCase()));

            it('should return a ResultAsync with transformed value', () => {
              const result = orElse(transform)(input);

              expectTypeOf(result).toEqualTypeOf<ResultAsync<string, never>>();
            });
          });

          describe('when input is a failure', () => {
            const transform = (x: string) => Promise.resolve(fail(x.toUpperCase()));

            it('should return a ResultAsync with transformed value', () => {
              const result = orElse(transform)(input);

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
        describe('when input is a success', () => {
          const input = succeed(42);

          it('should return a Result with original value', () => {
            const result = pipe(
              input,
              orElse((x: string) => succeed(x.toUpperCase())),
            );

            expectTypeOf(result).toEqualTypeOf<Result<42 | string, never>>();
          });
        });

        describe('when input is a failure', () => {
          const input: Result<number, string> = fail('error');

          describe('when input is a success', () => {
            it('should return a Result with transformed value', () => {
              const result = pipe(
                input,
                orElse((x: string) => succeed(x.toUpperCase())),
              );

              expectTypeOf(result).toEqualTypeOf<Result<number | string, never>>();
            });
          });

          describe('when input is a failure', () => {
            it('should return a Result with transformed value', () => {
              const result = pipe(
                input,
                orElse((x: string) => fail(x.toUpperCase())),
              );

              expectTypeOf(result).toEqualTypeOf<Result<number, string>>();
            });
          });
        });
      });

      describe('when output is asynchronous (Promise)', () => {
        describe('when input is a success', () => {
          const input = succeed(42);

          it('should return a ResultAsync with original value', () => {
            const result = pipe(
              input,
              orElse((x: string) => Promise.resolve(succeed(x.toUpperCase()))),
            );

            expectTypeOf(result).toEqualTypeOf<ResultAsync<42 | string, never>>();
          });
        });

        describe('when input is a failure', () => {
          const input: Result<number, string> = fail('error');

          describe('when input is a success', () => {
            it('should return a ResultAsync with transformed value', () => {
              const result = pipe(
                input,
                orElse((x) => Promise.resolve(succeed(x.toUpperCase()))),
              );

              expectTypeOf(result).toEqualTypeOf<ResultAsync<number | string, never>>();
            });
          });

          describe('when input is a failure', () => {
            it('should return a ResultAsync with transformed value', () => {
              const result = pipe(
                input,
                orElse((x) => Promise.resolve(fail(x.toUpperCase()))),
              );

              expectTypeOf(result).toEqualTypeOf<ResultAsync<number, string>>();
            });
          });
        });
      });
    });

    describe('when input is asynchronous (Promise)', () => {
      describe('when output is synchronous', () => {
        describe('when input is a success', () => {
          const input: ResultAsync<number, string> = Promise.resolve(succeed(42));

          it('should return a ResultAsync with original value', () => {
            const result = pipe(
              input,
              orElse((x: string) => succeed(x.toUpperCase())),
            );

            expectTypeOf(result).toEqualTypeOf<ResultAsync<number | string, never>>();
          });
        });

        describe('when input is a failure', () => {
          const input: ResultAsync<number, string> = Promise.resolve(fail('error'));

          describe('when input is a success', () => {
            it('should return a ResultAsync with transformed value', () => {
              const result = pipe(
                input,
                orElse((x: string) => succeed(x.toUpperCase())),
              );

              expectTypeOf(result).toEqualTypeOf<ResultAsync<number | string, never>>();
            });
          });

          describe('when input is a failure', () => {
            it('should return a ResultAsync with transformed value', () => {
              const result = pipe(
                input,
                orElse((x: string) => fail(x.toUpperCase())),
              );

              expectTypeOf(result).toEqualTypeOf<ResultAsync<number, string>>();
            });
          });
        });
      });

      describe('when output is asynchronous (Promise)', () => {
        describe('when input is a success', () => {
          const input: ResultAsync<number, string> = Promise.resolve(succeed(42));

          it('should return a ResultAsync with original value', () => {
            const result = pipe(
              input,
              orElse((x: string) => Promise.resolve(succeed(x.toUpperCase()))),
            );

            expectTypeOf(result).toEqualTypeOf<ResultAsync<number | string, never>>();
          });
        });

        describe('when input is a failure', () => {
          const input: ResultAsync<number, string> = Promise.resolve(fail('error'));

          describe('when input is a success', () => {
            it('should return a ResultAsync with transformed value', () => {
              const result = pipe(
                input,
                orElse((x) => Promise.resolve(succeed(x.toUpperCase()))),
              );

              expectTypeOf(result).toEqualTypeOf<ResultAsync<number | string, never>>();
            });
          });

          describe('when input is a failure', () => {
            it('should return a ResultAsync with transformed value', () => {
              const result = pipe(
                input,
                orElse((x) => Promise.resolve(fail(x.toUpperCase()))),
              );

              expectTypeOf(result).toEqualTypeOf<ResultAsync<number, string>>();
            });
          });
        });
      });
    });
  });
});
