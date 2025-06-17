import { describe, it, expect, vi } from 'vitest';

import { bind } from './bind';
import { fail } from './fail';
import { succeed } from './succeed';

import type { InferSuccess, Result, ResultAsync } from '../result';

describe('bind', () => {
  describe('when input is synchronous', () => {
    describe('when output is synchronous', () => {
      describe('when input is a success', () => {
        const input = succeed({ foo: 1 });

        describe('when output is a success', () => {
          const output = vi.fn((x: InferSuccess<typeof input>) => succeed(x.foo.toString()));

          it('should merge the results', () => {
            const result = bind('bar', output)(input);

            expect(result).toEqual({ type: 'Success', value: { foo: 1, bar: '1' } });
          });

          it('should call the function with the input', () => {
            bind('bar', output)(input);

            expect(output).toBeCalledWith({ foo: 1 });
          });
        });

        describe('when output is a failure', () => {
          const output = vi.fn((x: InferSuccess<typeof input>) => fail(x.foo.toString()));

          it('should return the failure', () => {
            const result = bind('bar', output)(input);

            expect(result).toEqual(fail('1'));
          });

          it('should call the function with the input', () => {
            bind('bar', output)(input);

            expect(output).toBeCalledWith({ foo: 1 });
          });
        });
      });

      describe('when input is a failure', () => {
        const input: Result<{ foo: number }, string> = fail('error');
        const output = vi.fn((x: InferSuccess<typeof input>) => succeed(x.foo.toString()));

        it('should return the failure', () => {
          const result = bind('bar', output)(input);

          expect(result).toEqual(fail('error'));
        });

        it('should not call the function', () => {
          bind('bar', output)(input);

          expect(output).not.toBeCalled();
        });
      });
    });

    describe('when output is asynchronous (Promise)', () => {
      const input = succeed({ foo: 1 });

      describe('when output is a success', () => {
        const output = vi.fn((x: InferSuccess<typeof input>) => succeed(Promise.resolve(x.foo.toString())));

        it('should merge the results', async () => {
          const result = await bind('bar', output)(input);

          expect(result).toEqual({ type: 'Success', value: { foo: 1, bar: '1' } });
        });

        it('should call the function with the input', async () => {
          await bind('bar', output)(input);

          expect(output).toBeCalledWith({ foo: 1 });
        });
      });

      describe('when output is a failure', () => {
        const output = vi.fn((x: InferSuccess<typeof input>) => fail(Promise.resolve(x.foo.toString())));

        it('should return the failure', async () => {
          const result = await bind('bar', output)(input);

          expect(result).toEqual(fail('1'));
        });

        it('should call the function with the input', async () => {
          await bind('bar', output)(input);

          expect(output).toBeCalledWith({ foo: 1 });
        });
      });
    });
  });

  describe('when input is asynchronous (Promise)', () => {
    describe('when output is synchronous', () => {
      const input = succeed(Promise.resolve({ foo: 1 }));

      describe('when output is a success', () => {
        const output = vi.fn((x: InferSuccess<typeof input>) => succeed(x.foo.toString()));

        it('should merge the results', async () => {
          const result = await bind('bar', output)(input);

          expect(result).toEqual({ type: 'Success', value: { foo: 1, bar: '1' } });
        });

        it('should call the function with the input', async () => {
          await bind('bar', output)(input);

          expect(output).toBeCalledWith({ foo: 1 });
        });
      });

      describe('when output is a failure', () => {
        const output = vi.fn((x: InferSuccess<typeof input>) => fail(x.foo.toString()));

        it('should return the failure', async () => {
          const result = await bind('bar', output)(input);

          expect(result).toEqual(fail('1'));
        });

        it('should call the function with the input', async () => {
          await bind('bar', output)(input);

          expect(output).toBeCalledWith({ foo: 1 });
        });
      });

      describe('when input is a failure', () => {
        const input: ResultAsync<{ foo: number }, string> = fail(Promise.resolve('error'));
        const output = vi.fn((x: InferSuccess<typeof input>) => succeed(x.foo.toString()));

        it('should return the failure', async () => {
          const result = await bind('bar', output)(input);

          expect(result).toEqual(fail('error'));
        });

        it('should not call the function', async () => {
          await bind('bar', output)(input);

          expect(output).not.toBeCalled();
        });
      });
    });

    describe('when output is asynchronous (Promise)', () => {
      const input = succeed(Promise.resolve({ foo: 1 }));

      describe('when output is a success', () => {
        const output = vi.fn((x: InferSuccess<typeof input>) => succeed(Promise.resolve(x.foo.toString())));

        it('should merge the results', async () => {
          const result = await bind('bar', output)(input);

          expect(result).toEqual({ type: 'Success', value: { foo: 1, bar: '1' } });
        });

        it('should call the function with the input', async () => {
          await bind('bar', output)(input);

          expect(output).toBeCalledWith({ foo: 1 });
        });
      });

      describe('when output is a failure', () => {
        const output = vi.fn((x: InferSuccess<typeof input>) => fail(Promise.resolve(x.foo.toString())));

        it('should return the failure', async () => {
          const result = await bind('bar', output)(input);

          expect(result).toEqual(fail('1'));
        });

        it('should call the function with the input', async () => {
          await bind('bar', output)(input);

          expect(output).toBeCalledWith({ foo: 1 });
        });
      });
    });
  });
});
