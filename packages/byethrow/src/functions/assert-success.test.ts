import { describe, expect, it } from 'vitest';

import { assertSuccess } from './assert-success';
import { fail } from './fail';
import { succeed } from './succeed';

import type { Result } from '../result';

describe('assertSuccess', () => {
  describe('when input is a success', () => {
    it('should return the success', () => {
      const input = succeed('value');

      const result = assertSuccess(input);

      expect(result).toEqual(input);
    });
  });

  describe('when input is a failure', () => {
    it('should throw an error', () => {
      const input = fail('error') as Result<number, never>;

      expect(() => assertSuccess(input)).toThrow('Expected a Success result, but received a Failure');
    });
  });
});
