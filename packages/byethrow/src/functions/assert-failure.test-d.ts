import { describe, expectTypeOf, it } from 'vitest';

import { assertFailure } from './assert-failure';
import { fail } from './fail';
import { succeed } from './succeed';

import type { Failure } from '../result';

describe('assertFailure', () => {
  describe('when input is synchronous', () => {
    describe('when input is a failure', () => {
      it('should infer failure type', () => {
        const input = fail('error');
        const result = assertFailure(input);

        expectTypeOf(result).toEqualTypeOf<Failure<string>>();
      });
    });

    describe('when input is a success', () => {
      it('should cause a type error', () => {
        const input = succeed('value');

        // @ts-expect-error
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        assertFailure(input);
      });
    });
  });

  describe('when input is asynchronous (Promise)', () => {
    describe('when input is a failure', () => {
      it('should infer failure type', () => {
        const input = fail(Promise.resolve('error'));
        const result = assertFailure(input);

        expectTypeOf(result).toEqualTypeOf<Promise<Failure<string>>>();
      });
    });

    describe('when input is a success', () => {
      it('should cause a type error', () => {
        const input = succeed(Promise.resolve('value'));

        // @ts-expect-error
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        assertFailure(input);
      });
    });
  });
});
