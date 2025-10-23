import { describe, it, expectTypeOf } from 'vitest';

import { bind } from './bind';
import { fail } from './fail';
import { pipe } from './pipe';
import { succeed } from './succeed';

import type { InferSuccess, Result, ResultAsync } from '../result';

describe('bind', () => {
  describe('when used without the pipe function', () => {
    describe('when input is synchronous', () => {
      describe('when output is synchronous', () => {
        describe('when input is a success', () => {
          const input = succeed({ foo: 1 });

          describe('when output is a success', () => {
            // eslint-disable-next-line unicorn/consistent-function-scoping
            const output = (x: InferSuccess<typeof input>) => succeed(x.foo.toString());

            it('should return a success result with both original and new values', () => {
              const result = bind('bar', output)(input);

              expectTypeOf(result).toEqualTypeOf<Result<{ foo: 1; bar: string }, never>>();
            });

            it('should allow binding to an existing key, overwriting the value', () => {
              const result = bind('foo', output)(input);

              expectTypeOf(result).toEqualTypeOf<Result<{ foo: string }, never>>();
            });
          });

          describe('when output is a failure', () => {
            // eslint-disable-next-line unicorn/consistent-function-scoping
            const output = (x: InferSuccess<typeof input>) => fail(x.foo.toString());

            it('should return a failure result with error type and updated value as never', () => {
              const result = bind('bar', output)(input);

              expectTypeOf(result).toEqualTypeOf<Result<{ foo: 1; bar: never }, string>>();
            });

            it('should allow binding to an existing key, overwriting the value', () => {
              const result = bind('foo', output)(input);

              expectTypeOf(result).toEqualTypeOf<Result<{ foo: never }, string>>();
            });
          });
        });

        describe('when input is a failure', () => {
          const input: Result<{ foo: number }, string> = fail('error');
          const output = (x: InferSuccess<typeof input>) => succeed(x.foo.toString());

          it('should propagate the failure without invoking output function', () => {
            const result = bind('bar', output)(input);

            expectTypeOf(result).toEqualTypeOf<Result<{ foo: number; bar: string }, string>>();
          });

          it('should allow binding to an existing key, overwriting the value', () => {
            const result = bind('foo', output)(input);

            expectTypeOf(result).toEqualTypeOf<Result<{ foo: string }, string>>();
          });
        });
      });

      describe('when output is asynchronous (Promise)', () => {
        const input = succeed({ foo: 1 });

        describe('when output is a success', () => {
          // eslint-disable-next-line unicorn/consistent-function-scoping
          const output = (x: InferSuccess<typeof input>) => succeed(Promise.resolve(x.foo.toString()));

          it('should return a ResultAsync with success containing resolved value', () => {
            const result = bind('bar', output)(input);

            expectTypeOf(result).toEqualTypeOf<ResultAsync<{ foo: 1; bar: string }, never>>();
          });

          it('should allow binding to an existing key, overwriting the value', () => {
            const result = bind('foo', output)(input);

            expectTypeOf(result).toEqualTypeOf<ResultAsync<{ foo: string }, never>>();
          });
        });

        describe('when output is a failure', () => {
          // eslint-disable-next-line unicorn/consistent-function-scoping
          const output = (x: InferSuccess<typeof input>) => fail(Promise.resolve(x.foo.toString()));

          it('should return a ResultAsync with failure containing resolved error', () => {
            const result = bind('bar', output)(input);

            expectTypeOf(result).toEqualTypeOf<ResultAsync<{ foo: 1; bar: never }, string>>();
          });

          it('should allow binding to an existing key, overwriting the value', () => {
            const result = bind('foo', output)(input);

            expectTypeOf(result).toEqualTypeOf<ResultAsync<{ foo: never }, string>>();
          });
        });
      });
    });

    describe('when input is asynchronous (Promise)', () => {
      describe('when output is synchronous', () => {
        const input = succeed(Promise.resolve({ foo: 1 }));

        describe('when output is a success', () => {
          // eslint-disable-next-line unicorn/consistent-function-scoping
          const output = (x: InferSuccess<typeof input>) => succeed(x.foo.toString());

          it('should return a ResultAsync with success when input and output resolve successfully', () => {
            const result = bind('bar', output)(input);

            expectTypeOf(result).toEqualTypeOf<ResultAsync<{ foo: number; bar: string }, never>>();
          });

          it('should allow binding to an existing key, overwriting the value', () => {
            const result = bind('foo', output)(input);

            expectTypeOf(result).toEqualTypeOf<ResultAsync<{ foo: string }, never>>();
          });
        });

        describe('when output is a failure', () => {
          // eslint-disable-next-line unicorn/consistent-function-scoping
          const output = (x: InferSuccess<typeof input>) => fail(x.foo.toString());

          it('should return a ResultAsync with failure when output fails after input success', () => {
            const result = bind('bar', output)(input);

            expectTypeOf(result).toEqualTypeOf<ResultAsync<{ foo: number; bar: never }, string>>();
          });

          it('should allow binding to an existing key, overwriting the value', () => {
            const result = bind('foo', output)(input);

            expectTypeOf(result).toEqualTypeOf<ResultAsync<{ foo: never }, string>>();
          });
        });

        describe('when input is a failure', () => {
          const input: ResultAsync<{ foo: number }, string> = fail(Promise.resolve('error'));
          const output = (x: InferSuccess<typeof input>) => succeed(x.foo.toString());

          it('should propagate the async failure without invoking output function', () => {
            const result = bind('bar', output)(input);

            expectTypeOf(result).toEqualTypeOf<ResultAsync<{ foo: number; bar: string }, string>>();
          });

          it('should allow binding to an existing key, overwriting the value', () => {
            const result = bind('foo', output)(input);

            expectTypeOf(result).toEqualTypeOf<ResultAsync<{ foo: string }, string>>();
          });
        });
      });

      describe('when output is asynchronous (Promise)', () => {
        const input = succeed(Promise.resolve({ foo: 1 }));

        describe('when output is a success', () => {
          // eslint-disable-next-line unicorn/consistent-function-scoping
          const output = (x: InferSuccess<typeof input>) => succeed(Promise.resolve(x.foo.toString()));

          it('should return a ResultAsync with nested resolved success values', () => {
            const result = bind('bar', output)(input);

            expectTypeOf(result).toEqualTypeOf<ResultAsync<{ foo: number; bar: string }, never>>();
          });

          it('should allow binding to an existing key, overwriting the value', () => {
            const result = bind('foo', output)(input);

            expectTypeOf(result).toEqualTypeOf<ResultAsync<{ foo: string }, never>>();
          });
        });

        describe('when output is a failure', () => {
          // eslint-disable-next-line unicorn/consistent-function-scoping
          const output = (x: InferSuccess<typeof input>) => fail(Promise.resolve(x.foo.toString()));

          it('should return a ResultAsync with nested resolved failure values', () => {
            const result = bind('bar', output)(input);

            expectTypeOf(result).toEqualTypeOf<ResultAsync<{ foo: number; bar: never }, string>>();
          });

          it('should allow binding to an existing key, overwriting the value', () => {
            const result = bind('foo', output)(input);

            expectTypeOf(result).toEqualTypeOf<ResultAsync<{ foo: never }, string>>();
          });
        });
      });
    });
  });

  describe('when used with the pipe function', () => {
    describe('when input is synchronous', () => {
      describe('when output is synchronous', () => {
        describe('when input is a success', () => {
          const input = succeed({ foo: 1 });

          describe('when output is a success', () => {
            it('should return a success result with both original and new values', () => {
              const result = pipe(
                input,
                bind('bar', (x) => succeed(x.foo.toString())),
              );

              expectTypeOf(result).toEqualTypeOf<Result<{ foo: 1; bar: string }, never>>();
            });

            it('should allow binding to an existing key, overwriting the value', () => {
              const result = pipe(
                input,
                bind('foo', (x) => succeed(x.foo.toString())),
              );

              expectTypeOf(result).toEqualTypeOf<Result<{ foo: string }, never>>();
            });
          });

          describe('when output is a failure', () => {
            it('should return a failure result with error type and updated value as never', () => {
              const result = pipe(
                input,
                bind('bar', (x) => fail(x.foo.toString())),
              );

              expectTypeOf(result).toEqualTypeOf<Result<{ foo: 1; bar: never }, string>>();
            });

            it('should allow binding to an existing key, overwriting the value', () => {
              const result = pipe(
                input,
                bind('foo', (x) => fail(x.foo.toString())),
              );

              expectTypeOf(result).toEqualTypeOf<Result<{ foo: never }, string>>();
            });
          });
        });

        describe('when input is a failure', () => {
          const input: Result<{ foo: number }, string> = fail('error');

          it('should propagate the failure without invoking output function', () => {
            const result = pipe(
              input,
              bind('bar', (x) => succeed(x.foo.toString())),
            );

            expectTypeOf(result).toEqualTypeOf<Result<{ foo: number; bar: string }, string>>();
          });

          it('should allow binding to an existing key, overwriting the value', () => {
            const result = pipe(
              input,
              bind('foo', (x) => succeed(x.foo.toString())),
            );

            expectTypeOf(result).toEqualTypeOf<Result<{ foo: string }, string>>();
          });
        });
      });

      describe('when output is asynchronous (Promise)', () => {
        const input = succeed({ foo: 1 });

        describe('when output is a success', () => {
          it('should return a ResultAsync with success containing resolved value', () => {
            const result = pipe(
              input,
              bind('bar', (x) => succeed(Promise.resolve(x.foo.toString()))),
            );

            expectTypeOf(result).toEqualTypeOf<ResultAsync<{ foo: 1; bar: string }, never>>();
          });

          it('should allow binding to an existing key, overwriting the value', () => {
            const result = pipe(
              input,
              bind('foo', (x) => succeed(Promise.resolve(x.foo.toString()))),
            );

            expectTypeOf(result).toEqualTypeOf<ResultAsync<{ foo: string }, never>>();
          });
        });

        describe('when output is a failure', () => {
          it('should return a ResultAsync with failure containing resolved error', () => {
            const result = pipe(
              input,
              bind('bar', (x) => fail(Promise.resolve(x.foo.toString()))),
            );

            expectTypeOf(result).toEqualTypeOf<ResultAsync<{ foo: 1; bar: never }, string>>();
          });

          it('should allow binding to an existing key, overwriting the value', () => {
            const result = pipe(
              input,
              bind('foo', (x) => fail(Promise.resolve(x.foo.toString()))),
            );

            expectTypeOf(result).toEqualTypeOf<ResultAsync<{ foo: never }, string>>();
          });
        });
      });
    });

    describe('when input is asynchronous (Promise)', () => {
      describe('when output is synchronous', () => {
        const input = succeed(Promise.resolve({ foo: 1 }));

        describe('when output is a success', () => {
          it('should return a ResultAsync with success when input and output resolve successfully', () => {
            const result = pipe(
              input,
              bind('bar', (x) => succeed(x.foo.toString())),
            );

            expectTypeOf(result).toEqualTypeOf<ResultAsync<{ foo: number; bar: string }, never>>();
          });

          it('should allow binding to an existing key, overwriting the value', () => {
            const result = pipe(
              input,
              bind('foo', (x) => succeed(x.foo.toString())),
            );

            expectTypeOf(result).toEqualTypeOf<ResultAsync<{ foo: string }, never>>();
          });
        });

        describe('when output is a failure', () => {
          it('should return a ResultAsync with failure when output fails after input success', () => {
            const result = pipe(
              input,
              bind('bar', (x) => fail(x.foo.toString())),
            );

            expectTypeOf(result).toEqualTypeOf<ResultAsync<{ foo: number; bar: never }, string>>();
          });

          it('should allow binding to an existing key, overwriting the value', () => {
            const result = pipe(
              input,
              bind('foo', (x) => fail(x.foo.toString())),
            );

            expectTypeOf(result).toEqualTypeOf<ResultAsync<{ foo: never }, string>>();
          });
        });

        describe('when input is a failure', () => {
          const input: ResultAsync<{ foo: number }, string> = fail(Promise.resolve('error'));

          it('should propagate the async failure without invoking output function', () => {
            const result = pipe(
              input,
              bind('bar', (x) => succeed(x.foo.toString())),
            );

            expectTypeOf(result).toEqualTypeOf<ResultAsync<{ foo: number; bar: string }, string>>();
          });

          it('should allow binding to an existing key, overwriting the value', () => {
            const result = pipe(
              input,
              bind('foo', (x) => succeed(x.foo.toString())),
            );

            expectTypeOf(result).toEqualTypeOf<ResultAsync<{ foo: string }, string>>();
          });
        });
      });

      describe('when output is asynchronous (Promise)', () => {
        const input = succeed(Promise.resolve({ foo: 1 }));

        describe('when output is a success', () => {
          it('should return a ResultAsync with nested resolved success values', () => {
            const result = pipe(
              input,
              bind('bar', (x) => succeed(Promise.resolve(x.foo.toString()))),
            );

            expectTypeOf(result).toEqualTypeOf<ResultAsync<{ foo: number; bar: string }, never>>();
          });

          it('should allow binding to an existing key, overwriting the value', () => {
            const result = pipe(
              input,
              bind('foo', (x) => succeed(Promise.resolve(x.foo.toString()))),
            );

            expectTypeOf(result).toEqualTypeOf<ResultAsync<{ foo: string }, never>>();
          });
        });

        describe('when output is a failure', () => {
          it('should return a ResultAsync with nested resolved failure values', () => {
            const result = pipe(
              input,
              bind('bar', (x) => fail(Promise.resolve(x.foo.toString()))),
            );

            expectTypeOf(result).toEqualTypeOf<ResultAsync<{ foo: number; bar: never }, string>>();
          });

          it('should allow binding to an existing key, overwriting the value', () => {
            const result = pipe(
              input,
              bind('foo', (x) => fail(Promise.resolve(x.foo.toString()))),
            );

            expectTypeOf(result).toEqualTypeOf<ResultAsync<{ foo: never }, string>>();
          });
        });
      });
    });
  });
});
