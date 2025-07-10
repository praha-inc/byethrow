import { describe, expect, it } from 'vitest';

import { assertFailure } from './assert-failure';
import { fail } from './fail';
import { succeed } from './succeed';

import type { Result, ResultAsync } from '../result';

describe('assertFailure', () => {
  describe('when input is synchronous', () => {
    describe('when input is a failure', () => {
      it('should return the failure', () => {
        const input = fail('error');

        const result = assertFailure(input);

        expect(result).toEqual(fail('error'));
      });
    });

    describe('when input is a success', () => {
      it('should throw an error', () => {
        const input = succeed('value') as Result<never, string>;

        expect(() => assertFailure(input)).toThrow('Expected a Failure result, but received a Success');
      });
    });
  });

  describe('when input is asynchronous (Promise)', () => {
    describe('when input is a failure', () => {
      it('should return the failure', async () => {
        const input = fail(Promise.resolve('error'));

        const result = await assertFailure(input);

        expect(result).toEqual(fail('error'));
      });
    });

    describe('when input is a success', () => {
      it('should throw an error', async () => {
        const input = succeed(Promise.resolve('value')) as ResultAsync<never, string>;

        await expect(assertFailure(input)).rejects.toThrow('Expected a Failure result, but received a Success');
      });
    });
  });
});
