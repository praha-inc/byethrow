import { describe, expect, it, vi } from 'vitest';

import { fail } from './fail';
import { mapError } from './map-error';
import { succeed } from './succeed';

describe('mapError', () => {
  const transform = vi.fn((x: string) => x.length);

  describe('when Result is synchronous', () => {
    describe('when Result is a failure', () => {
      const input = fail('error');

      it('should apply the function to the input', () => {
        const result = mapError(transform)(input);

        expect(result).toEqual(fail(5));
      });

      it('should call the function with the input', () => {
        mapError(transform)(input);

        expect(transform).toBeCalledWith('error');
      });
    });

    describe('when Result is a success', () => {
      const input = succeed(2);

      it('should return the same success', () => {
        const result = mapError(transform)(input);

        expect(result).toEqual(succeed(2));
      });

      it('should not call the function', () => {
        mapError(transform)(input);

        expect(transform).not.toBeCalled();
      });
    });
  });

  describe('when Result is asynchronous (Promise)', () => {
    describe('when Result is a failure', () => {
      const input = fail(Promise.resolve('error'));

      it('should apply the function to the input', async () => {
        const result = await mapError(transform)(input);

        expect(result).toEqual(fail(5));
      });

      it('should call the function with the input', async () => {
        await mapError(transform)(input);

        expect(transform).toBeCalledWith('error');
      });
    });

    describe('when Result is a success', () => {
      const input = succeed(Promise.resolve(2));

      it('should return the same success', async () => {
        const result = await mapError(transform)(input);

        expect(result).toEqual(succeed(2));
      });

      it('should not call the function', async () => {
        await mapError(transform)(input);

        expect(transform).not.toBeCalled();
      });
    });
  });
});
