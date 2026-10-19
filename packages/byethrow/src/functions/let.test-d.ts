import { describe, it, expectTypeOf } from 'vitest';

import { bind } from './bind';
import { do as do_ } from './do';
import { fail } from './fail';
import { let as let_ } from './let';
import { pipe } from './pipe';
import { succeed } from './succeed';

import type { InferSuccess, Result, ResultAsync } from '../result';

describe('let', () => {
  describe('when used without the pipe function', () => {
    describe('when input is synchronous', () => {
      describe('when input is a success', () => {
        const input = succeed({ foo: 1 });
        const output = (x: InferSuccess<typeof input>) => x.foo.toString();

        it('should return a success result with both original and new values', () => {
          const result = let_('bar', output)(input);

          expectTypeOf(result).toEqualTypeOf<Result<{ foo: 1; bar: string }, never>>();
        });

        it('should allow binding to an existing key, overwriting the value', () => {
          const result = let_('foo', output)(input);

          expectTypeOf(result).toEqualTypeOf<Result<{ foo: string }, never>>();
        });
      });

      describe('when input is a failure', () => {
        const input: Result<{ foo: number }, string> = fail('error');
        const output = (x: InferSuccess<typeof input>) => x.foo.toString();

        it('should propagate the failure without invoking output function', () => {
          const result = let_('bar', output)(input);

          expectTypeOf(result).toEqualTypeOf<Result<{ foo: number; bar: string }, string>>();
        });

        it('should allow binding to an existing key, overwriting the value', () => {
          const result = let_('foo', output)(input);

          expectTypeOf(result).toEqualTypeOf<Result<{ foo: string }, string>>();
        });
      });
    });

    describe('when input is asynchronous (Promise)', () => {
      describe('when input is a success', () => {
        const input = Promise.resolve(succeed({ foo: 1 }));
        const output = (x: InferSuccess<typeof input>) => x.foo.toString();

        it('should return a ResultAsync with success containing both original and new values', () => {
          const result = let_('bar', output)(input);

          expectTypeOf(result).toEqualTypeOf<ResultAsync<{ foo: 1; bar: string }, never>>();
        });

        it('should allow binding to an existing key, overwriting the value', () => {
          const result = let_('foo', output)(input);

          expectTypeOf(result).toEqualTypeOf<ResultAsync<{ foo: string }, never>>();
        });
      });

      describe('when input is a failure', () => {
        const input: ResultAsync<{ foo: number }, string> = Promise.resolve(fail('error'));
        const output = (x: InferSuccess<typeof input>) => x.foo.toString();

        it('should propagate the async failure without invoking output function', () => {
          const result = let_('bar', output)(input);

          expectTypeOf(result).toEqualTypeOf<ResultAsync<{ foo: number; bar: string }, string>>();
        });

        it('should allow binding to an existing key, overwriting the value', () => {
          const result = let_('foo', output)(input);

          expectTypeOf(result).toEqualTypeOf<ResultAsync<{ foo: string }, string>>();
        });
      });
    });
  });

  describe('when used with the pipe function', () => {
    describe('when input is synchronous', () => {
      describe('when input is a success', () => {
        const input = succeed({ foo: 1 });

        it('should return a success result with both original and new values', () => {
          const result = pipe(
            input,
            let_('bar', (x) => x.foo.toString()),
          );

          expectTypeOf(result).toEqualTypeOf<Result<{ foo: 1; bar: string }, never>>();
        });

        it('should allow binding to an existing key, overwriting the value', () => {
          const result = pipe(
            input,
            let_('foo', (x) => x.foo.toString()),
          );

          expectTypeOf(result).toEqualTypeOf<Result<{ foo: string }, never>>();
        });

        it('should infer a literal type for the returned value', () => {
          const result = pipe(
            input,
            let_('bar', () => 'baz'),
          );

          expectTypeOf(result).toEqualTypeOf<Result<{ foo: 1; bar: 'baz' }, never>>();
        });
      });

      describe('when input is a failure', () => {
        const input: Result<{ foo: number }, string> = fail('error');

        it('should propagate the failure without invoking output function', () => {
          const result = pipe(
            input,
            let_('bar', (x) => x.foo.toString()),
          );

          expectTypeOf(result).toEqualTypeOf<Result<{ foo: number; bar: string }, string>>();
        });

        it('should allow binding to an existing key, overwriting the value', () => {
          const result = pipe(
            input,
            let_('foo', (x) => x.foo.toString()),
          );

          expectTypeOf(result).toEqualTypeOf<Result<{ foo: string }, string>>();
        });
      });
    });

    describe('when input is asynchronous (Promise)', () => {
      describe('when input is a success', () => {
        const input = Promise.resolve(succeed({ foo: 1 }));

        it('should return a ResultAsync with success containing both original and new values', () => {
          const result = pipe(
            input,
            let_('bar', (x) => x.foo.toString()),
          );

          expectTypeOf(result).toEqualTypeOf<ResultAsync<{ foo: 1; bar: string }, never>>();
        });

        it('should allow binding to an existing key, overwriting the value', () => {
          const result = pipe(
            input,
            let_('foo', (x) => x.foo.toString()),
          );

          expectTypeOf(result).toEqualTypeOf<ResultAsync<{ foo: string }, never>>();
        });
      });

      describe('when input is a failure', () => {
        const input: ResultAsync<{ foo: number }, string> = Promise.resolve(fail('error'));

        it('should propagate the async failure without invoking output function', () => {
          const result = pipe(
            input,
            let_('bar', (x) => x.foo.toString()),
          );

          expectTypeOf(result).toEqualTypeOf<ResultAsync<{ foo: number; bar: string }, string>>();
        });

        it('should allow binding to an existing key, overwriting the value', () => {
          const result = pipe(
            input,
            let_('foo', (x) => x.foo.toString()),
          );

          expectTypeOf(result).toEqualTypeOf<ResultAsync<{ foo: string }, string>>();
        });
      });
    });

    describe('when combined with bind', () => {
      it('should accumulate values from both bind and let', () => {
        const result = pipe(
          do_(),
          bind('x', () => succeed(1)),
          bind('y', () => succeed(2)),
          let_('z', ({ x, y }) => x + y),
        );

        expectTypeOf(result).toEqualTypeOf<Result<{ x: 1; y: 2; z: number }, never>>();
      });

      it('should keep the failure type from bind', () => {
        const result = pipe(
          do_(),
          bind('x', () => succeed(1) as Result<number, 'XError'>),
          let_('y', ({ x }) => x * 2),
        );

        expectTypeOf(result).toEqualTypeOf<Result<{ x: number; y: number }, 'XError'>>();
      });
    });
  });
});
