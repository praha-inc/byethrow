import { describe, expect, it } from 'vitest';

import { assertSuccess } from './assert-success';
import { fail } from './fail';
import { succeed } from './succeed';

import type { Result, ResultAsync } from '../result';

describe('assertSuccess', () => {
  describe('when input is synchronous', () => {
    describe('when input is a success', () => {
      it('should return the success', () => {
        const input = succeed('value');

        const result = assertSuccess(input);

        expect(result).toEqual(succeed('value'));
      });
    });

    describe('when input is a failure', () => {
      it('should throw an error', () => {
        const input = fail('error') as Result<number, never>;

        expect(() => assertSuccess(input)).toThrow('Expected a Success result, but received a Failure');
      });
    });
  });

  describe('when input is asynchronous (Promise)', () => {
    describe('when input is a success', () => {
      it('should return the success', async () => {
        const input = succeed(Promise.resolve('value'));

        const result = await assertSuccess(input);

        expect(result).toEqual(succeed('value'));
      });
    });

    describe('when input is a failure', () => {
      it('should throw an error', async () => {
        const input = fail(Promise.resolve('error')) as ResultAsync<number, never>;

        await expect(assertSuccess(input)).rejects.toThrow('Expected a Success result, but received a Failure');
      });
    });
  });
});
