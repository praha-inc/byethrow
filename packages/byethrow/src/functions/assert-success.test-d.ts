import { describe, expectTypeOf, it } from 'vitest';

import { assertSuccess } from './assert-success';
import { fail } from './fail';
import { succeed } from './succeed';

import type { Success } from '../result';

describe('assertSuccess', () => {
  describe('when input is synchronous', () => {
    describe('when input is a success', () => {
      it('should infer success type', () => {
        const input = succeed('value');
        const result = assertSuccess(input);

        expectTypeOf(result).toEqualTypeOf<Success<string>>();
      });
    });

    describe('when input is a failure', () => {
      it('should cause a type error', () => {
        const input = fail('error');

        // @ts-expect-error
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        assertSuccess(input);
      });
    });
  });

  describe('when input is asynchronous (Promise)', () => {
    describe('when input is a success', () => {
      it('should infer success type', () => {
        const input = Promise.resolve(succeed('value'));
        const result = assertSuccess(input);

        expectTypeOf(result).toEqualTypeOf<Promise<Success<string>>>();
      });
    });

    describe('when input is a failure', () => {
      it('should cause a type error', () => {
        const input = Promise.resolve(fail('error'));

        // @ts-expect-error
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        assertSuccess(input);
      });
    });
  });
});
