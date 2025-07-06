import { describe, expectTypeOf, it } from 'vitest';

import { assertSuccess } from './assert-success';
import { fail } from './fail';
import { succeed } from './succeed';

import type { Success } from '../result';

describe('assertSuccess', () => {
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
      assertSuccess(input);
    });
  });
});
