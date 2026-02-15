import { describe, it, expect } from 'vitest';

import { fail } from './fail';
import { fn } from './fn';
import { succeed } from './succeed';

describe('fn', () => {
  describe('when Result is synchronous', () => {
    describe('when catch handler is provided', () => {
      it('should succeed when no error is thrown', () => {
        const result = fn({
          try: () => 'success',
          catch: String,
        })();

        expect(result).toEqual(succeed('success'));
      });

      it('should fail when an error is thrown', () => {
        const result = fn({
          try: () => {
            throw new Error('failure');
          },
          catch: String,
        })();

        expect(result).toEqual(fail('Error: failure'));
      });

      it('should pass arguments', () => {
        const result = fn({
          try: (a: string, b: string) => `${a} ${b}`,
          catch: String,
        })('Hello', 'World');

        expect(result).toEqual(succeed('Hello World'));
      });
    });

    describe('when safe mode is enabled', () => {
      it('should succeed when no error is thrown', () => {
        const result = fn({
          safe: true,
          try: () => 'success',
        })();

        expect(result).toEqual(succeed('success'));
      });

      it('should throw error when one is thrown', () => {
        expect(() =>
          fn({
            safe: true,
            try: () => {
              throw new Error('failure');
            },
          })(),
        ).toThrow('failure');
      });
    });
  });

  describe('when Result is asynchronous (Promise)', () => {
    describe('when catch handler is provided', () => {
      it('should return a Promise', () => {
        const result = fn({
          // eslint-disable-next-line @typescript-eslint/require-await
          try: async () => 'success',
          catch: String,
        })();

        expect(result).toBeInstanceOf(Promise);
      });

      it('should succeed when promise resolves', async () => {
        const result = await fn({
          // eslint-disable-next-line @typescript-eslint/require-await
          try: async () => 'success',
          catch: String,
        })();

        expect(result).toEqual(succeed('success'));
      });

      it('should fail when promise rejects', async () => {
        const result = await fn({
          // eslint-disable-next-line @typescript-eslint/require-await
          try: async () => {
            throw new Error('failure');
          },
          catch: String,
        })();

        expect(result).toEqual(fail('Error: failure'));
      });

      it('should pass arguments', async () => {
        const result = await fn({
          // eslint-disable-next-line @typescript-eslint/require-await
          try: async (a: string, b: string) => `${a} ${b}`,
          catch: String,
        })('Hello', 'World');

        expect(result).toEqual(succeed('Hello World'));
      });
    });

    describe('when safe mode is enabled', () => {
      it('should return a Promise', () => {
        const result = fn({
          safe: true,
          // eslint-disable-next-line @typescript-eslint/require-await
          try: async () => 'success',
        })();

        expect(result).toBeInstanceOf(Promise);
      });

      it('should succeed when promise resolves', async () => {
        const result = await fn({
          safe: true,
          // eslint-disable-next-line @typescript-eslint/require-await
          try: async () => 'success',
        })();

        expect(result).toEqual(succeed('success'));
      });

      it('should throw when promise rejects', async () => {
        await expect(() => fn({
          safe: true,
          // eslint-disable-next-line @typescript-eslint/require-await
          try: async () => {
            throw new Error('failure');
          },
        })()).rejects.toThrow('failure');
      });
    });
  });
});
