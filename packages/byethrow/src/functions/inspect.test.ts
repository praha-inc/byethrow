import { describe, expect, it, vi } from 'vitest';

import { fail } from './fail';
import { inspect } from './inspect';
import { succeed } from './succeed';

describe('inspect', () => {
  describe('when input is synchronous', () => {
    describe('when output is synchronous', () => {
      const sideEffect = vi.fn((x: number) => x);

      describe('when input is a success', () => {
        const input = succeed(42);

        it('should return the original success result unchanged', () => {
          const result = inspect(sideEffect)(input);

          expect(result).toEqual(succeed(42));
        });

        it('should call the side effect function with the success value', () => {
          inspect(sideEffect)(input);

          expect(sideEffect).toHaveBeenCalledWith(42);
          expect(sideEffect).toHaveBeenCalledTimes(1);
        });
      });

      describe('when input is a failure', () => {
        const input = fail('error message');

        it('should return the original failure result unchanged', () => {
          const result = inspect(sideEffect)(input);

          expect(result).toEqual(fail('error message'));
        });

        it('should not call the side effect function', () => {
          inspect(sideEffect)(input);

          expect(sideEffect).not.toHaveBeenCalled();
        });
      });
    });

    describe('when output is asynchronous (Promise)', () => {
      const sideEffect = vi.fn((x: number) => Promise.resolve(x));

      describe('when input is a success', () => {
        const input = succeed(42);

        it('should return the original success result unchanged', async () => {
          const result = await inspect(sideEffect)(input);

          expect(result).toEqual(succeed(42));
        });

        it('should call the side effect function with the success value', async () => {
          await inspect(sideEffect)(input);

          expect(sideEffect).toHaveBeenCalledWith(42);
          expect(sideEffect).toHaveBeenCalledTimes(1);
        });
      });

      describe('when input is a failure', () => {
        const input = fail('error message');

        it('should return the original failure result unchanged', async () => {
          const result = await inspect(sideEffect)(input);

          expect(result).toEqual(fail('error message'));
        });

        it('should not call the side effect function', async () => {
          await inspect(sideEffect)(input);

          expect(sideEffect).not.toHaveBeenCalled();
        });
      });
    });
  });

  describe('when input is asynchronous (Promise)', () => {
    describe('when output is synchronous', () => {
      const sideEffect = vi.fn((x: number) => x);

      describe('when input is a success', () => {
        const input = succeed(Promise.resolve(42));

        it('should return the original success result unchanged', async () => {
          const result = await inspect(sideEffect)(input);

          expect(result).toEqual(succeed(42));
        });

        it('should call the side effect function with the success value', async () => {
          await inspect(sideEffect)(input);

          expect(sideEffect).toHaveBeenCalledWith(42);
          expect(sideEffect).toHaveBeenCalledTimes(1);
        });
      });

      describe('when input is a failure', () => {
        const input = fail(Promise.resolve('async error'));

        it('should return the original failure result unchanged', async () => {
          const result = await inspect(sideEffect)(input);

          expect(result).toEqual(fail('async error'));
        });

        it('should not call the side effect function', async () => {
          await inspect(sideEffect)(input);

          expect(sideEffect).not.toHaveBeenCalled();
        });
      });
    });

    describe('when output is asynchronous (Promise)', () => {
      const sideEffect = vi.fn((x: number) => Promise.resolve(x));

      describe('when input is a success', () => {
        const input = succeed(Promise.resolve(42));

        it('should return the original success result unchanged', async () => {
          const result = await inspect(sideEffect)(input);

          expect(result).toEqual(succeed(42));
        });

        it('should call the side effect function with the success value', async () => {
          await inspect(sideEffect)(input);

          expect(sideEffect).toHaveBeenCalledWith(42);
          expect(sideEffect).toHaveBeenCalledTimes(1);
        });
      });

      describe('when input is a failure', () => {
        const input = fail(Promise.resolve('async error'));

        it('should return the original failure result unchanged', async () => {
          const result = await inspect(sideEffect)(input);

          expect(result).toEqual(fail('async error'));
        });

        it('should not call the side effect function', async () => {
          await inspect(sideEffect)(input);

          expect(sideEffect).not.toHaveBeenCalled();
        });
      });
    });
  });
});
