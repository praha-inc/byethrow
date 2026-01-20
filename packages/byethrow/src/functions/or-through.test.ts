import { describe, expect, it, vi } from 'vitest';

import { fail } from './fail';
import { orThrough } from './or-through';
import { succeed } from './succeed';

describe('orThrough', () => {
  describe('when input is synchronous', () => {
    describe('when output is synchronous', () => {
      describe('when output is a success', () => {
        const transform = vi.fn((error: string) => succeed(error.toUpperCase()));

        describe('when input is a success', () => {
          const input = succeed(2);

          it('should return the same success', () => {
            const result = orThrough(transform)(input);

            expect(result).toEqual(succeed(2));
          });

          it('should not call the function', () => {
            orThrough(transform)(input);

            expect(transform).not.toBeCalled();
          });
        });

        describe('when input is a failure', () => {
          const input = fail('error');

          it('should return the original failure when function returns success', () => {
            const result = orThrough(transform)(input);

            expect(result).toEqual(fail('error'));
          });

          it('should call the function with the error', () => {
            orThrough(transform)(input);

            expect(transform).toBeCalledWith('error');
          });
        });
      });

      describe('when output is a failure', () => {
        const transform = vi.fn((error: string) => fail(error.toUpperCase()));

        describe('when input is a success', () => {
          const input = succeed(2);

          it('should return the same success', () => {
            const result = orThrough(transform)(input);

            expect(result).toEqual(succeed(2));
          });

          it('should not call the function', () => {
            orThrough(transform)(input);

            expect(transform).not.toBeCalled();
          });
        });

        describe('when input is a failure', () => {
          const input = fail('error');

          it('should return the original failure when function returns success', () => {
            const result = orThrough(transform)(input);

            expect(result).toEqual(fail('ERROR'));
          });

          it('should call the function with the error', () => {
            orThrough(transform)(input);

            expect(transform).toBeCalledWith('error');
          });
        });
      });
    });

    describe('when output is asynchronous (Promise)', () => {
      describe('when output is a success', () => {
        const transform = vi.fn((error: string) => succeed(Promise.resolve(error.toUpperCase())));

        describe('when input is a success', () => {
          const input = succeed(2);

          it('should return the same success', async () => {
            const result = await orThrough(transform)(input);

            expect(result).toEqual(succeed(2));
          });

          it('should not call the function', async () => {
            await orThrough(transform)(input);

            expect(transform).not.toBeCalled();
          });
        });

        describe('when input is a failure', () => {
          const input = fail('error');

          it('should return the original failure when function returns success', async () => {
            const result = await orThrough(transform)(input);

            expect(result).toEqual(fail('error'));
          });

          it('should call the function with the error', async () => {
            await orThrough(transform)(input);

            expect(transform).toBeCalledWith('error');
          });
        });
      });

      describe('when output is a failure', () => {
        const transform = vi.fn((error: string) => fail(Promise.resolve(error.toUpperCase())));

        describe('when input is a success', () => {
          const input = succeed(2);

          it('should return the same success', async () => {
            const result = await orThrough(transform)(input);

            expect(result).toEqual(succeed(2));
          });

          it('should not call the function', async () => {
            await orThrough(transform)(input);

            expect(transform).not.toBeCalled();
          });
        });

        describe('when input is a failure', () => {
          const input = fail('error');

          it('should return the original failure when function returns success', async () => {
            const result = await orThrough(transform)(input);

            expect(result).toEqual(fail('ERROR'));
          });

          it('should call the function with the error', async () => {
            await orThrough(transform)(input);

            expect(transform).toBeCalledWith('error');
          });
        });
      });
    });
  });

  describe('when input is asynchronous (Promise)', () => {
    describe('when output is synchronous', () => {
      describe('when output is a success', () => {
        const transform = vi.fn((error: string) => succeed(error.toUpperCase()));

        describe('when input is a success', () => {
          const input = succeed(Promise.resolve(2));

          it('should return the same success', async () => {
            const result = await orThrough(transform)(input);

            expect(result).toEqual(succeed(2));
          });

          it('should not call the function', async () => {
            await orThrough(transform)(input);

            expect(transform).not.toBeCalled();
          });
        });

        describe('when input is a failure', () => {
          const input = fail(Promise.resolve('error'));

          it('should return the original failure when function returns success', async () => {
            const result = await orThrough(transform)(input);

            expect(result).toEqual(fail('error'));
          });

          it('should call the function with the error', async () => {
            await orThrough(transform)(input);

            expect(transform).toBeCalledWith('error');
          });
        });
      });

      describe('when output is a failure', () => {
        const transform = vi.fn((error: string) => fail(error.toUpperCase()));

        describe('when input is a success', () => {
          const input = succeed(Promise.resolve(2));

          it('should return the same success', async () => {
            const result = await orThrough(transform)(input);

            expect(result).toEqual(succeed(2));
          });

          it('should not call the function', async () => {
            await orThrough(transform)(input);

            expect(transform).not.toBeCalled();
          });
        });

        describe('when input is a failure', () => {
          const input = fail(Promise.resolve('error'));

          it('should return the original failure when function returns success', async () => {
            const result = await orThrough(transform)(input);

            expect(result).toEqual(fail('ERROR'));
          });

          it('should call the function with the error', async () => {
            await orThrough(transform)(input);

            expect(transform).toBeCalledWith('error');
          });
        });
      });
    });

    describe('when output is asynchronous (Promise)', () => {
      describe('when output is a success', () => {
        const transform = vi.fn((error: string) => succeed(Promise.resolve(error.toUpperCase())));

        describe('when input is a success', () => {
          const input = succeed(Promise.resolve(2));

          it('should return the same success', async () => {
            const result = await orThrough(transform)(input);

            expect(result).toEqual(succeed(2));
          });

          it('should not call the function', async () => {
            await orThrough(transform)(input);

            expect(transform).not.toBeCalled();
          });
        });

        describe('when input is a failure', () => {
          const input = fail(Promise.resolve('error'));

          it('should return the original failure when function returns success', async () => {
            const result = await orThrough(transform)(input);

            expect(result).toEqual(fail('error'));
          });

          it('should call the function with the error', async () => {
            await orThrough(transform)(input);

            expect(transform).toBeCalledWith('error');
          });
        });
      });

      describe('when output is a failure', () => {
        const transform = vi.fn((error: string) => fail(Promise.resolve(error.toUpperCase())));

        describe('when input is a success', () => {
          const input = succeed(Promise.resolve(2));

          it('should return the same success', async () => {
            const result = await orThrough(transform)(input);

            expect(result).toEqual(succeed(2));
          });

          it('should not call the function', async () => {
            await orThrough(transform)(input);

            expect(transform).not.toBeCalled();
          });
        });

        describe('when input is a failure', () => {
          const input = fail(Promise.resolve('error'));

          it('should return the original failure when function returns success', async () => {
            const result = await orThrough(transform)(input);

            expect(result).toEqual(fail('ERROR'));
          });

          it('should call the function with the error', async () => {
            await orThrough(transform)(input);

            expect(transform).toBeCalledWith('error');
          });
        });
      });
    });
  });
});
