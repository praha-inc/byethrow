import { describe, expect, it, vi } from 'vitest';

import { andThen } from './and-then';
import { fail } from './fail';
import { succeed } from './succeed';

describe('andThen', () => {
  describe('when input is synchronous', () => {
    describe('when output is synchronous', () => {
      const transform = vi.fn((x: number) => succeed(x.toString()));

      describe('when input is a success', () => {
        const input = succeed(2);

        it('should apply the function to the input', () => {
          const result = andThen(transform)(input);

          expect(result).toEqual(succeed('2'));
        });

        it('should call the function with the input', () => {
          andThen(transform)(input);

          expect(transform).toBeCalledWith(2);
        });
      });

      describe('when input is a failure', () => {
        const input = fail('error');

        it('should return the same failure', () => {
          const result = andThen(transform)(input);

          expect(result).toEqual(fail('error'));
        });

        it('should not call the function', () => {
          andThen(transform)(input);

          expect(transform).not.toBeCalled();
        });
      });
    });

    describe('when output is asynchronous (Promise)', () => {
      const transform = vi.fn((x: number) => succeed(Promise.resolve(x.toString())));

      describe('when input is a success', () => {
        const input = succeed(2);

        it('should apply the function to the input', async () => {
          const result = await andThen(transform)(input);

          expect(result).toEqual(succeed('2'));
        });

        it('should call the function with the input', async () => {
          await andThen(transform)(input);

          expect(transform).toBeCalledWith(2);
        });
      });

      describe('when input is a failure', () => {
        const input = fail('error');

        it('should return the same failure', async () => {
          const result = await andThen(transform)(input);

          expect(result).toEqual(fail('error'));
        });

        it('should not call the function', async () => {
          await andThen(transform)(input);

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

        it('should apply the function to the input', async () => {
          const result = await andThen(transform)(input);

          expect(result).toEqual(succeed('2'));
        });

        it('should call the function with the input', async () => {
          await andThen(transform)(input);

          expect(transform).toBeCalledWith(2);
        });
      });

      describe('when input is a failure', () => {
        const input = fail(Promise.resolve('error'));

        it('should return the same failure', async () => {
          const result = await andThen(transform)(input);

          expect(result).toEqual(fail('error'));
        });

        it('should not call the function', async () => {
          await andThen(transform)(input);

          expect(transform).not.toBeCalled();
        });
      });
    });

    describe('when output is asynchronous (Promise)', () => {
      const transform = vi.fn((x: number) => succeed(Promise.resolve(x.toString())));

      describe('when input is a success', () => {
        const input = succeed(Promise.resolve(2));

        it('should apply the function to the input', async () => {
          const result = await andThen(transform)(input);

          expect(result).toEqual(succeed('2'));
        });

        it('should call the function with the input', async () => {
          await andThen(transform)(input);

          expect(transform).toBeCalledWith(2);
        });
      });

      describe('when input is a failure', () => {
        const input = fail(Promise.resolve('error'));

        it('should return the same failure', async () => {
          const result = await andThen(transform)(input);

          expect(result).toEqual(fail('error'));
        });

        it('should not call the function', async () => {
          await andThen(transform)(input);

          expect(transform).not.toBeCalled();
        });
      });
    });
  });
});
