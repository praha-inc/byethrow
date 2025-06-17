import { describe, expect, it, vi } from 'vitest';

import { fail } from './fail';
import { map } from './map';
import { succeed } from './succeed';

describe('map', () => {
  const transform = vi.fn((x: number) => x.toString());

  describe('when input is synchronous', () => {
    describe('when input is a success', () => {
      const input = succeed(2);

      it('should apply the function to the input', () => {
        const result = map(transform)(input);

        expect(result).toEqual(succeed('2'));
      });

      it('should call the function with the input', () => {
        map(transform)(input);

        expect(transform).toBeCalledWith(2);
      });
    });

    describe('when input is a failure', () => {
      const input = fail('error');

      it('should return the same failure', () => {
        const result = map(transform)(input);

        expect(result).toEqual(fail('error'));
      });

      it('should not call the function', () => {
        map(transform)(input);

        expect(transform).not.toBeCalled();
      });
    });
  });

  describe('when input is asynchronous (Promise)', () => {
    describe('when input is a success', () => {
      const input = succeed(Promise.resolve(2));

      it('should apply the function to the input', async () => {
        const result = await map(transform)(input);

        expect(result).toEqual(succeed('2'));
      });

      it('should call the function with the input', async () => {
        await map(transform)(input);

        expect(transform).toBeCalledWith(2);
      });
    });

    describe('when input is a failure', () => {
      const input = fail(Promise.resolve('error'));

      it('should return the same failure', async () => {
        const result = await map(transform)(input);

        expect(result).toEqual(fail('error'));
      });

      it('should not call the function', async () => {
        await map(transform)(input);

        expect(transform).not.toBeCalled();
      });
    });
  });
});
