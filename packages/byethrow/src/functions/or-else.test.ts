import { describe, expect, it, vi } from 'vitest';

import { fail } from './fail';
import { orElse } from './or-else';
import { succeed } from './succeed';

describe('orElse', () => {
  describe('when input is synchronous', () => {
    describe('when output is synchronous', () => {
      describe('when input is a success', () => {
        const input = succeed(42);
        const transform = vi.fn((x: string) => succeed(x.toUpperCase()));

        it('should return the same success', () => {
          const result = orElse(transform)(input);

          expect(result).toEqual(succeed(42));
        });

        it('should not call the function', () => {
          orElse(transform)(input);

          expect(transform).not.toBeCalled();
        });
      });

      describe('when input is a failure', () => {
        const input = fail('error');

        describe('when output is a success', () => {
          const transform = vi.fn((x: string) => succeed(x.toUpperCase()));

          it('should apply the function to the error', () => {
            const result = orElse(transform)(input);

            expect(result).toEqual(succeed('ERROR'));
          });

          it('should call the function with the error', () => {
            orElse(transform)(input);

            expect(transform).toBeCalledWith('error');
          });
        });

        describe('when output is a failure', () => {
          const transform = vi.fn((x: string) => fail(x.toUpperCase()));

          it('should apply the function to the error', () => {
            const result = orElse(transform)(input);

            expect(result).toEqual(fail('ERROR'));
          });

          it('should call the function with the error', () => {
            orElse(transform)(input);

            expect(transform).toBeCalledWith('error');
          });
        });
      });
    });

    describe('when output is asynchronous (Promise)', () => {
      describe('when input is a success', () => {
        const input = succeed(42);
        const transform = vi.fn((x: string) => succeed(Promise.resolve(x.toUpperCase())));

        it('should return the same success', async () => {
          const result = await orElse(transform)(input);

          expect(result).toEqual(succeed(42));
        });

        it('should not call the function', async () => {
          await orElse(transform)(input);

          expect(transform).not.toBeCalled();
        });
      });

      describe('when input is a failure', () => {
        const input = fail('error');

        describe('when output is a success', () => {
          const transform = vi.fn((x: string) => succeed(Promise.resolve(x.toUpperCase())));

          it('should apply the function to the error', async () => {
            const result = await orElse(transform)(input);

            expect(result).toEqual(succeed('ERROR'));
          });

          it('should call the function with the error', async () => {
            await orElse(transform)(input);

            expect(transform).toBeCalledWith('error');
          });
        });

        describe('when output is a failure', () => {
          const transform = vi.fn((x: string) => fail(Promise.resolve(x.toUpperCase())));

          it('should apply the function to the error', async () => {
            const result = await orElse(transform)(input);

            expect(result).toEqual(fail('ERROR'));
          });

          it('should call the function with the error', async () => {
            await orElse(transform)(input);

            expect(transform).toBeCalledWith('error');
          });
        });
      });
    });
  });

  describe('when input is asynchronous (Promise)', () => {
    describe('when output is synchronous', () => {
      describe('when input is a success', () => {
        const input = succeed(Promise.resolve(42));
        const transform = vi.fn((x: string) => succeed(x.toUpperCase()));

        it('should return the same success', async () => {
          const result = await orElse(transform)(input);

          expect(result).toEqual(succeed(42));
        });

        it('should not call the function', async () => {
          await orElse(transform)(input);

          expect(transform).not.toBeCalled();
        });
      });

      describe('when input is a failure', () => {
        const input = fail(Promise.resolve('error'));

        describe('when output is a success', () => {
          const transform = vi.fn((x: string) => succeed(x.toUpperCase()));

          it('should apply the function to the error', async () => {
            const result = await orElse(transform)(input);

            expect(result).toEqual(succeed('ERROR'));
          });

          it('should call the function with the error', async () => {
            await orElse(transform)(input);

            expect(transform).toBeCalledWith('error');
          });
        });

        describe('when output is a failure', () => {
          const transform = vi.fn((x: string) => fail(x.toUpperCase()));

          it('should apply the function to the error', async () => {
            const result = await orElse(transform)(input);

            expect(result).toEqual(fail('ERROR'));
          });

          it('should call the function with the error', async () => {
            await orElse(transform)(input);

            expect(transform).toBeCalledWith('error');
          });
        });
      });
    });

    describe('when output is asynchronous (Promise)', () => {
      describe('when input is a success', () => {
        const input = succeed(Promise.resolve(42));
        const transform = vi.fn((x: string) => succeed(Promise.resolve(x.toUpperCase())));

        it('should return the same success', async () => {
          const result = await orElse(transform)(input);

          expect(result).toEqual(succeed(42));
        });

        it('should not call the function', async () => {
          await orElse(transform)(input);

          expect(transform).not.toBeCalled();
        });
      });

      describe('when input is a failure', () => {
        const input = fail(Promise.resolve('error'));

        describe('when output is a success', () => {
          const transform = vi.fn((x: string) => succeed(Promise.resolve(x.toUpperCase())));

          it('should apply the function to the error', async () => {
            const result = await orElse(transform)(input);

            expect(result).toEqual(succeed('ERROR'));
          });

          it('should call the function with the error', async () => {
            await orElse(transform)(input);

            expect(transform).toBeCalledWith('error');
          });
        });

        describe('when output is a failure', () => {
          const transform = vi.fn((x: string) => fail(Promise.resolve(x.toUpperCase())));

          it('should apply the function to the error', async () => {
            const result = await orElse(transform)(input);

            expect(result).toEqual(fail('ERROR'));
          });

          it('should call the function with the error', async () => {
            await orElse(transform)(input);

            expect(transform).toBeCalledWith('error');
          });
        });
      });
    });
  });
});
