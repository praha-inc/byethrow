import { describe, it, expect, vi } from 'vitest';

import { fail } from './fail';
import { let as let_ } from './let';
import { succeed } from './succeed';

import type { InferSuccess, Result, ResultAsync } from '../result';

describe('let', () => {
  describe('when input is synchronous', () => {
    describe('when input is a success', () => {
      const input = succeed({ foo: 1 });
      const output = vi.fn((x: InferSuccess<typeof input>) => x.foo.toString());

      it('should merge the value', () => {
        const result = let_('bar', output)(input);

        expect(result).toEqual({ type: 'Success', value: { foo: 1, bar: '1' } });
      });

      it('should call the function with the input', () => {
        let_('bar', output)(input);

        expect(output).toBeCalledWith({ foo: 1 });
      });

      it('should allow binding to an existing key, overwriting the value', () => {
        const result = let_('foo', output)(input);

        expect(result).toEqual({ type: 'Success', value: { foo: '1' } });
      });
    });

    describe('when input is a failure', () => {
      const input: Result<{ foo: number }, string> = fail('error');
      const output = vi.fn((x: InferSuccess<typeof input>) => x.foo.toString());

      it('should return the failure', () => {
        const result = let_('bar', output)(input);

        expect(result).toEqual(fail('error'));
      });

      it('should not call the function', () => {
        let_('bar', output)(input);

        expect(output).not.toBeCalled();
      });
    });
  });

  describe('when input is asynchronous (Promise)', () => {
    describe('when input is a success', () => {
      const input = Promise.resolve(succeed({ foo: 1 }));
      const output = vi.fn((x: InferSuccess<typeof input>) => x.foo.toString());

      it('should merge the value', async () => {
        const result = await let_('bar', output)(input);

        expect(result).toEqual({ type: 'Success', value: { foo: 1, bar: '1' } });
      });

      it('should call the function with the input', async () => {
        await let_('bar', output)(input);

        expect(output).toBeCalledWith({ foo: 1 });
      });

      it('should allow binding to an existing key, overwriting the value', async () => {
        const result = await let_('foo', output)(input);

        expect(result).toEqual({ type: 'Success', value: { foo: '1' } });
      });
    });

    describe('when input is a failure', () => {
      const input: ResultAsync<{ foo: number }, string> = Promise.resolve(fail('error'));
      const output = vi.fn((x: InferSuccess<typeof input>) => x.foo.toString());

      it('should return the failure', async () => {
        const result = await let_('bar', output)(input);

        expect(result).toEqual(fail('error'));
      });

      it('should not call the function', async () => {
        await let_('bar', output)(input);

        expect(output).not.toBeCalled();
      });
    });
  });
});
