import { describe, it, expect } from 'vitest';

import { fail } from './fail';
import { succeed } from './succeed';
import { try as try_ } from './try';

describe('try', () => {
  describe('when Result is synchronous', () => {
    describe('when catch handler is provided', () => {
      it('should succeed when no error is thrown', () => {
        const result = try_({
          try: () => 'success',
          catch: String,
        })();

        expect(result).toEqual(succeed('success'));
      });

      it('should fail when an error is thrown', () => {
        const result = try_({
          try: () => {
            throw new Error('failure');
          },
          catch: String,
        })();

        expect(result).toEqual(fail('Error: failure'));
      });

      it('should pass arguments', () => {
        const result = try_({
          try: (a: string, b: string) => `${a} ${b}`,
          catch: String,
        })('Hello', 'World');

        expect(result).toEqual(succeed('Hello World'));
      });
    });

    describe('when safe mode is enabled', () => {
      it('should succeed when no error is thrown', () => {
        const result = try_({
          safe: true,
          try: () => 'success',
        })();

        expect(result).toEqual(succeed('success'));
      });

      it('should throw error when one is thrown', () => {
        expect(() =>
          try_({
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
        const result = try_({
          // eslint-disable-next-line @typescript-eslint/require-await
          try: async () => 'success',
          catch: String,
        })();

        expect(result).toBeInstanceOf(Promise);
      });

      it('should succeed when promise resolves', async () => {
        const result = await try_({
          // eslint-disable-next-line @typescript-eslint/require-await
          try: async () => 'success',
          catch: String,
        })();

        expect(result).toEqual(succeed('success'));
      });

      it('should fail when promise rejects', async () => {
        const result = await try_({
          // eslint-disable-next-line @typescript-eslint/require-await
          try: async () => {
            throw new Error('failure');
          },
          catch: String,
        })();

        expect(result).toEqual(fail('Error: failure'));
      });

      it('should pass arguments', async () => {
        const result = await try_({
          // eslint-disable-next-line @typescript-eslint/require-await
          try: async (a: string, b: string) => `${a} ${b}`,
          catch: String,
        })('Hello', 'World');

        expect(result).toEqual(succeed('Hello World'));
      });
    });

    describe('when safe mode is enabled', () => {
      it('should return a Promise', () => {
        const result = try_({
          safe: true,
          // eslint-disable-next-line @typescript-eslint/require-await
          try: async () => 'success',
        })();

        expect(result).toBeInstanceOf(Promise);
      });

      it('should succeed when promise resolves', async () => {
        const result = await try_({
          safe: true,
          // eslint-disable-next-line @typescript-eslint/require-await
          try: async () => 'success',
        })();

        expect(result).toEqual(succeed('success'));
      });

      it('should throw when promise rejects', async () => {
        await expect(() => try_({
          safe: true,
          // eslint-disable-next-line @typescript-eslint/require-await
          try: async () => {
            throw new Error('failure');
          },
        })()).rejects.toThrow('failure');
      });
    });
  });

  describe('when Promise is passed directly', () => {
    describe('when catch handler is provided', () => {
      it('should succeed when promise resolves', async () => {
        const result = await try_({
          try: Promise.resolve('success'),
          catch: String,
        });

        expect(result).toEqual(succeed('success'));
      });

      it('should fail when promise rejects', async () => {
        const result = await try_({
          try: Promise.reject(new Error('failure')),
          catch: String,
        });

        expect(result).toEqual(fail('Error: failure'));
      });
    });

    describe('when safe mode is enabled', () => {
      it('should succeed when promise resolves', async () => {
        const result = await try_({
          safe: true,
          try: Promise.resolve('success'),
        });

        expect(result).toEqual(succeed('success'));
      });

      it('should preserve promise rejections in safe mode', async () => {
        const result = try_({
          safe: true,
          try: Promise.reject(new Error('failure')),
        });

        await expect(result).rejects.toThrow('failure');
      });
    });
  });
});
