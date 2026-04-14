import { R } from '@praha/byethrow';
import { describe, expect, it, vi } from 'vitest';

import { toBeSuccess } from './to-be-success';

import type { MatcherState } from '../types/matcher';

const createMatcherState = (state?: Partial<MatcherState>): MatcherState => ({
  isNot: false,
  utils: {
    matcherHint: vi.fn((matcherName: string) => matcherName),
    printReceived: vi.fn((value: unknown) => String(value).toString()),
  },
  ...state,
});

describe('toBeSuccess', () => {
  describe('when received is a Success', () => {
    const state = createMatcherState();
    const value = R.succeed(42);

    it('should return pass as true', () => {
      const { pass } = toBeSuccess.call(state, value);

      expect(pass).toBe(true);
    });

    it('should call callback with the success value', () => {
      const callback = vi.fn();

      toBeSuccess.call(state, value, callback);

      expect(callback).toHaveBeenCalledWith(42);
    });
  });

  describe('when received is a Failure', () => {
    const state = createMatcherState();
    const value = R.fail('error');

    it('should return pass as false', () => {
      const { pass } = toBeSuccess.call(state, value);

      expect(pass).toBe(false);
    });

    it('should not call callback', () => {
      const callback = vi.fn();

      toBeSuccess.call(state, value, callback);

      expect(callback).not.toHaveBeenCalled();
    });

    it('should return a message describing the received value', () => {
      const { message } = toBeSuccess.call(state, value);

      expect(message()).toContain('Expected value to be a success result');
    });
  });

  describe('when received is a string', () => {
    const state = createMatcherState();
    const value = 'not a result';

    it('should return pass as false', () => {
      const { pass } = toBeSuccess.call(state, value);

      expect(pass).toBe(false);
    });

    it('should not call callback', () => {
      const callback = vi.fn();

      toBeSuccess.call(state, value, callback);

      expect(callback).not.toHaveBeenCalled();
    });

    it('should return a message describing the received value', () => {
      const { message } = toBeSuccess.call(state, value);

      expect(message()).toContain('Expected value to be a success result');
    });
  });

  describe('when isNot is true', () => {
    const state = createMatcherState({ isNot: true });

    describe.each([
      { type: 'Success', value: R.succeed(42) },
      { type: 'Failure', value: R.fail('error') },
      { type: 'string', value: 'not a result' },
    ])('when received is a $type', ({ value }) => {
      it('should return pass as true', () => {
        const { pass } = toBeSuccess.call(state, value);

        expect(pass).toBe(true);
      });

      it('should not call callback', () => {
        const callback = vi.fn();

        toBeSuccess.call(state, value, callback);

        expect(callback).not.toHaveBeenCalled();
      });

      it('should return a message suggesting to use toBeFailure instead', () => {
        const { message } = toBeSuccess.call(state, value);

        expect(message()).toBe('Do not use .not with .toBeSuccess, please use .toBeFailure instead.');
      });
    });
  });
});
