import { describe, it, expect } from 'vitest';

import { fail } from './fail';
import { succeed } from './succeed';
import { unwrapError } from './unwrap-error';

describe('unwrapError', () => {
  describe('when result is synchronous', () => {
    it('should return the value if result is failure', () => {
      const result = fail('error');
      const value = unwrapError(result);

      expect(value).toBe('error');
    });

    it('should throw an error if result is success', () => {
      const result = succeed('success');

      expect(() => unwrapError(result)).toThrow('success');
    });
  });

  describe('when result is asynchronous (Promise)', () => {
    it('should return the value if result is failure', async () => {
      const result = await fail(Promise.resolve('error'));
      const value = unwrapError(result);

      expect(value).toBe('error');
    });

    it('should throw an error if result is success', async () => {
      const result = await succeed(Promise.resolve('success'));

      expect(() => unwrapError(result)).toThrow('success');
    });
  });
});
