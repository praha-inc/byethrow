import { describe, it, expect } from 'vitest';

import { fail } from './fail';
import { succeed } from './succeed';
import { unwrap } from './unwrap';

describe('unwrap', () => {
  describe('when result is synchronous', () => {
    it('should return the value if result is success', () => {
      const result = succeed('success');
      const value = unwrap(result);

      expect(value).toBe('success');
    });

    it('should throw an error if result is failure', () => {
      const result = fail('error');

      expect(() => unwrap(result)).toThrow('error');
    });
  });

  describe('when result is asynchronous (Promise)', () => {
    it('should return the value if result is success', async () => {
      const asyncResult = succeed(Promise.resolve('async success'));
      const value = await unwrap(asyncResult);

      expect(value).toBe('async success');
    });

    it('should throw an error if result is failure', async () => {
      const asyncResult = fail(Promise.resolve('async error'));

      await expect(unwrap(asyncResult)).rejects.toThrow('async error');
    });
  });
});
