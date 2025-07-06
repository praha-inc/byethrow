import { describe, expect, it } from 'vitest';

import { assertFailure } from './assert-failure';
import { fail } from './fail';
import { succeed } from './succeed';

import type { Result } from '../result';

describe('assertFailure', () => {
  describe('when input is a failure', () => {
    it('should return the failure', () => {
      const input = fail('error');

      const result = assertFailure(input);

      expect(result).toEqual(input);
    });
  });

  describe('when input is a success', () => {
    it('should throw an error', () => {
      const input = succeed('value') as Result<never, string>;

      expect(() => assertFailure(input)).toThrow('Expected a Failure result, but received a Success');
    });
  });
});
