import { describe, expect, it } from 'vitest';

import { fail } from './fail';
import { succeed } from './succeed';
import { unwrap } from './unwrap';

describe('unwrap', () => {
  describe('when input is synchronous', () => {
    describe('when input is a success', () => {
      const input = succeed(42);

      it('should return the success value', () => {
        const result = unwrap(input);

        expect(result).toBe(42);
      });

      it('should return the success value when default is provided', () => {
        const result = unwrap(input, 0);

        expect(result).toBe(42);
      });
    });

    describe('when input is a failure', () => {
      const input = fail('error');

      it('should throw the error when no default is provided', () => {
        try {
          unwrap(input);
        } catch (error) {
          expect(error).toBe('error');
        }
        expect.hasAssertions();
      });

      it('should return the default value when default is provided', () => {
        const result = unwrap(input, 99);

        expect(result).toBe(99);
      });
    });
  });

  describe('when input is asynchronous (Promise)', () => {
    describe('when input is a success', () => {
      const input = succeed(Promise.resolve(42));

      it('should return the success value', async () => {
        const result = await unwrap(input);

        expect(result).toBe(42);
      });

      it('should return the success value when default is provided', async () => {
        const result = await unwrap(input, 0);

        expect(result).toBe(42);
      });
    });

    describe('when input is a failure', () => {
      const input = fail(Promise.resolve('error'));

      it('should throw the error when no default is provided', async () => {
        await expect(unwrap(input)).rejects.toBe('error');
      });

      it('should return the default value when default is provided', async () => {
        const result = await unwrap(input, 99);

        expect(result).toBe(99);
      });
    });
  });
});
