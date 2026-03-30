import { describe, expect, it } from 'vitest';

import { fail } from './fail';
import { succeed } from './succeed';
import { unwrapError } from './unwrap-error';

describe('unwrapError', () => {
  describe('when input is synchronous', () => {
    describe('when input is a success', () => {
      const input = succeed(42);

      it('should throw the success value when no default is provided', () => {
        try {
          unwrapError(input);
        } catch (error) {
          expect(error).toBe(42);
        }
        expect.hasAssertions();
      });

      it('should return the default value when default is provided', () => {
        const result = unwrapError(input, 0);

        expect(result).toBe(0);
      });
    });

    describe('when input is a failure', () => {
      const input = fail('error');

      it('should return the failure value', () => {
        const result = unwrapError(input, 99);

        expect(result).toBe('error');
      });

      it('should return the failure value when default is provided', () => {
        const result = unwrapError(input, 99);

        expect(result).toBe('error');
      });
    });
  });

  describe('when input is asynchronous (Promise)', () => {
    describe('when input is a success', () => {
      const input = succeed(Promise.resolve(42));

      it('should throw the success value when no default is provided', async () => {
        await expect(unwrapError(input)).rejects.toBe(42);
      });

      it('should return the default value when default is provided', async () => {
        const result = await unwrapError(input, 0);

        expect(result).toBe(0);
      });
    });

    describe('when input is a failure', () => {
      const input = fail(Promise.resolve('error'));

      it('should return the failure value', async () => {
        const result = await unwrapError(input, 99);

        expect(result).toBe('error');
      });

      it('should return the failure value when default is provided', async () => {
        const result = await unwrapError(input, 99);

        expect(result).toBe('error');
      });
    });
  });
});
