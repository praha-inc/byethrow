import { describe, expect, it, vi } from 'vitest';

import { andThrough } from './and-through';
import { fail } from './fail';
import { succeed } from './succeed';

describe('andThrough', () => {
  describe('when input is synchronous', () => {
    describe('when output is synchronous', () => {
      const transform = vi.fn((x: number) => succeed(x.toString()));

      describe('when input is a success', () => {
        const input = succeed(2);

        it('should not apply the function to the input', () => {
          const result = andThrough(transform)(input);

          expect(result).toEqual(succeed(2));
        });

        it('should call the function with the input', () => {
          andThrough(transform)(input);

          expect(transform).toBeCalledWith(2);
        });
      });

      describe('when input is a failure', () => {
        const input = fail('error');

        it('should return the same failure', () => {
          const result = andThrough(transform)(input);

          expect(result).toEqual(fail('error'));
        });

        it('should not call the function', () => {
          andThrough(transform)(input);

          expect(transform).not.toBeCalled();
        });
      });
    });

    describe('when output is asynchronous (Promise)', () => {
      const transform = vi.fn((x: number) => succeed(Promise.resolve(x.toString())));

      describe('when input is a success', () => {
        const input = succeed(2);

        it('should not apply the function to the input', async () => {
          const result = await andThrough(transform)(input);

          expect(result).toEqual(succeed(2));
        });

        it('should call the function with the input', async () => {
          await andThrough(transform)(input);

          expect(transform).toBeCalledWith(2);
        });
      });

      describe('when input is a failure', () => {
        const input = fail('error');

        it('should return the same failure', async () => {
          const result = await andThrough(transform)(input);

          expect(result).toEqual(fail('error'));
        });

        it('should not call the function', async () => {
          await andThrough(transform)(input);

          expect(transform).not.toBeCalled();
        });
      });
    });
  });

  describe('when input is asynchronous (Promise)', () => {
    describe('when output is synchronous', () => {
      const transform = vi.fn((x: number) => succeed(x.toString()));

      describe('when input is a success', () => {
        const input = succeed(Promise.resolve(2));

        it('should not apply the function to the input', async () => {
          const result = await andThrough(transform)(input);

          expect(result).toEqual(succeed(2));
        });

        it('should call the function with the input', async () => {
          await andThrough(transform)(input);

          expect(transform).toBeCalledWith(2);
        });
      });

      describe('when input is a failure', () => {
        const input = fail(Promise.resolve('error'));

        it('should return the same failure', async () => {
          const result = await andThrough(transform)(input);

          expect(result).toEqual(fail('error'));
        });

        it('should not call the function', async () => {
          await andThrough(transform)(input);

          expect(transform).not.toBeCalled();
        });
      });
    });

    describe('when output is asynchronous (Promise)', () => {
      const transform = vi.fn((x: number) => succeed(Promise.resolve(x.toString())));

      describe('when input is a success', () => {
        const input = succeed(Promise.resolve(2));

        it('should not apply the function to the input', async () => {
          const result = await andThrough(transform)(input);

          expect(result).toEqual(succeed(2));
        });

        it('should call the function with the input', async () => {
          await andThrough(transform)(input);

          expect(transform).toBeCalledWith(2);
        });
      });

      describe('when input is a failure', () => {
        const input = fail(Promise.resolve('error'));

        it('should return the same failure', async () => {
          const result = await andThrough(transform)(input);

          expect(result).toEqual(fail('error'));
        });

        it('should not call the function', async () => {
          await andThrough(transform)(input);

          expect(transform).not.toBeCalled();
        });
      });
    });
  });
});
