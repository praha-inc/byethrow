import { describe, expect, it } from 'vitest';

import { fail } from './fail';
import { isResult } from './is-result';
import { succeed } from './succeed';

describe('isResult', () => {
  describe('when input ia a success', () => {
    const input = succeed('value');

    it('should return true for', () => {
      expect(isResult(input)).toBe(true);
    });
  });

  describe('when input ia a failure', () => {
    const input = fail('error');

    it('should return true for', () => {
      expect(isResult(input)).toBe(true);
    });
  });

  describe('when input is a primitive value', () => {
    it('should return false for null', () => {
      expect(isResult(null)).toBe(false);
    });

    it('should return false for undefined', () => {
      // eslint-disable-next-line unicorn/no-useless-undefined
      expect(isResult(undefined)).toBe(false);
    });

    it('should return false for string', () => {
      expect(isResult('string')).toBe(false);
    });

    it('should return false for number', () => {
      expect(isResult(42)).toBe(false);
    });

    it('should return false for boolean', () => {
      expect(isResult(true)).toBe(false);
      expect(isResult(false)).toBe(false);
    });
  });

  describe('when input is a object', () => {
    it('should return false for objects without type property', () => {
      expect(isResult({})).toBe(false);
      expect(isResult({ value: 'test' })).toBe(false);
      expect(isResult({ error: 'test' })).toBe(false);
    });

    it('should return false for objects with invalid type property', () => {
      expect(isResult({ type: 'InvalidType' })).toBe(false);
      expect(isResult({ type: 123 })).toBe(false);
      expect(isResult({ type: true })).toBe(false);
    });

    it('should return false for objects without value or error properties', () => {
      expect(isResult({ type: 'Success' })).toBe(false);
      expect(isResult({ type: 'Failure' })).toBe(false);
    });
  });
});
