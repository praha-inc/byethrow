import { describe, expectTypeOf, it } from 'vitest';

import { map } from './map';
import { pipe } from './pipe';
import { succeed } from './succeed';

import type { Result, ResultAsync } from '../result';

describe('map', () => {
  describe('when used without the pipe function', () => {
    // eslint-disable-next-line unicorn/consistent-function-scoping
    const transform = (x: number) => x.toString();

    describe('when Result is synchronous', () => {
      it('should transform the value type in a synchronous Result', () => {
        const input = succeed(2);
        const result = map(transform)(input);

        expectTypeOf(result).toEqualTypeOf<Result<string, never>>();
      });
    });

    describe('when Result is asynchronous (Promise)', () => {
      it('should transform the value type in an asynchronous ResultAsync', () => {
        const input = succeed(Promise.resolve(2));
        const result = map(transform)(input);

        expectTypeOf(result).toEqualTypeOf<ResultAsync<string, never>>();
      });
    });
  });

  describe('when used with the pipe function', () => {
    describe('when Result is synchronous', () => {
      it('should transform the value type in a synchronous Result', () => {
        const input = succeed(2);
        const result = pipe(
          input,
          map((x) => x.toString()),
        );

        expectTypeOf(result).toEqualTypeOf<Result<string, never>>();
      });
    });

    describe('when Result is asynchronous (Promise)', () => {
      it('should transform the value type in an asynchronous ResultAsync', () => {
        const input = succeed(Promise.resolve(2));
        const result = pipe(
          input,
          map((x) => x.toString()),
        );

        expectTypeOf(result).toEqualTypeOf<ResultAsync<string, never>>();
      });
    });
  });
});
