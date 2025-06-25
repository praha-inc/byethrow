import { describe, expect, it, vi } from 'vitest';

import { fail } from './fail';
import { inspectError } from './inspect-error';
import { succeed } from './succeed';

describe('inspectError', () => {
  describe('when input is synchronous', () => {
    describe('when output is synchronous', () => {
      const sideEffect = vi.fn((x: string) => x);

      describe('when input is a failure', () => {
        const input = fail('error message');

        it('should return the original failure result unchanged', () => {
          const result = inspectError(sideEffect)(input);

          expect(result).toEqual(fail('error message'));
        });

        it('should call the side effect function with the error value', () => {
          inspectError(sideEffect)(input);

          expect(sideEffect).toBeCalledWith('error message');
          expect(sideEffect).toHaveBeenCalledTimes(1);
        });
      });

      describe('when input is a success', () => {
        const input = succeed(42);

        it('should return the original success result unchanged', () => {
          const result = inspectError(sideEffect)(input);

          expect(result).toEqual(succeed(42));
        });

        it('should not call the side effect function', () => {
          inspectError(sideEffect)(input);

          expect(sideEffect).not.toBeCalled();
        });
      });
    });

    describe('when output is asynchronous (Promise)', () => {
      const sideEffect = vi.fn((x: string) => Promise.resolve(x));

      describe('when input is a failure', () => {
        const input = fail('error message');

        it('should return the original failure result unchanged', () => {
          const result = inspectError(sideEffect)(input);

          expect(result).toEqual(fail('error message'));
        });

        it('should call the side effect function with the error value', () => {
          inspectError(sideEffect)(input);

          expect(sideEffect).toBeCalledWith('error message');
          expect(sideEffect).toHaveBeenCalledTimes(1);
        });
      });

      describe('when input is a success', () => {
        const input = succeed(42);

        it('should return the original success result unchanged', () => {
          const result = inspectError(sideEffect)(input);

          expect(result).toEqual(succeed(42));
        });

        it('should not call the side effect function', () => {
          inspectError(sideEffect)(input);

          expect(sideEffect).not.toBeCalled();
        });
      });
    });
  });

  describe('when input is asynchronous (Promise)', () => {
    describe('when output is synchronous', () => {
      const sideEffect = vi.fn((x: string) => x);

      describe('when input is a failure', () => {
        const input = fail(Promise.resolve('async error'));

        it('should return the original failure result unchanged', async () => {
          const result = await inspectError(sideEffect)(input);

          expect(result).toEqual(fail('async error'));
        });

        it('should call the side effect function with the error value', async () => {
          await inspectError(sideEffect)(input);

          expect(sideEffect).toBeCalledWith('async error');
          expect(sideEffect).toHaveBeenCalledTimes(1);
        });
      });

      describe('when input is a success', () => {
        const input = succeed(Promise.resolve(42));

        it('should return the original success result unchanged', async () => {
          const result = await inspectError(sideEffect)(input);

          expect(result).toEqual(succeed(42));
        });

        it('should not call the side effect function', async () => {
          await inspectError(sideEffect)(input);

          expect(sideEffect).not.toBeCalled();
        });
      });
    });

    describe('when output is asynchronous (Promise)', () => {
      const sideEffect = vi.fn((x: string) => Promise.resolve(x));

      describe('when input is a failure', () => {
        const input = fail(Promise.resolve('async error'));

        it('should return the original failure result unchanged', async () => {
          const result = await inspectError(sideEffect)(input);

          expect(result).toEqual(fail('async error'));
        });

        it('should call the side effect function with the error value', async () => {
          await inspectError(sideEffect)(input);

          expect(sideEffect).toBeCalledWith('async error');
          expect(sideEffect).toHaveBeenCalledTimes(1);
        });
      });

      describe('when input is a success', () => {
        const input = succeed(Promise.resolve(42));

        it('should return the original success result unchanged', async () => {
          const result = await inspectError(sideEffect)(input);

          expect(result).toEqual(succeed(42));
        });

        it('should not call the side effect function', async () => {
          await inspectError(sideEffect)(input);

          expect(sideEffect).not.toBeCalled();
        });
      });
    });
  });
});
