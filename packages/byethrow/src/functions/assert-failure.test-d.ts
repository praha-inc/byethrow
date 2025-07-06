import { describe, expectTypeOf, it } from 'vitest';

import { assertFailure } from './assert-failure';
import { fail } from './fail';
import { succeed } from './succeed';

import type { Failure } from '../result';

describe('assertFailure', () => {
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
      assertFailure(input);
    });
  });
});
