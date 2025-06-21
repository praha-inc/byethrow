import { describe, expect, it } from 'vitest';

import { combine } from './combine';
import { fail } from './fail';
import { succeed } from './succeed';

describe('combine', () => {
  describe('when input is an array', () => {
    describe('when all results are successful', () => {
      it('should return a Success with an array of values', () => {
        const input = [succeed(1), succeed(2), succeed(3)];
        const result = combine(input);

        expect(result).toEqual(succeed([1, 2, 3]));
      });
    });

    describe('when some results are failures', () => {
      it('should return a Failure with an array of errors', () => {
        const input = [succeed(1), fail('error1'), fail('error2')];
        const result = combine(input);

        expect(result).toEqual(fail(['error1', 'error2']));
      });
    });

    describe('when all results are failures', () => {
      it('should return a Failure with an array of all errors', () => {
        const input = [fail('error1'), fail('error2'), fail('error3')];
        const result = combine(input);

        expect(result).toEqual(fail(['error1', 'error2', 'error3']));
      });
    });

    describe('when array is empty', () => {
      it('should return a Success with an empty array', () => {
        const input: never[] = [];
        const result = combine(input);

        expect(result).toEqual(succeed([]));
      });
    });

    describe('when input contains async results', () => {
      it('should handle async successful results', async () => {
        const input = [
          succeed(Promise.resolve(1)),
          succeed(Promise.resolve(2)),
          succeed(Promise.resolve(3)),
        ];
        const result = await combine(input);

        expect(result).toEqual(succeed([1, 2, 3]));
      });

      it('should handle mixed sync and async successful results', async () => {
        const input = [
          succeed(1),
          succeed(Promise.resolve(2)),
          succeed(3),
        ];
        const result = await combine(input);

        expect(result).toEqual(succeed([1, 2, 3]));
      });

      it('should handle async failures', async () => {
        const input = [
          succeed(Promise.resolve(1)),
          fail(Promise.resolve('error1')),
          fail(Promise.resolve('error2')),
        ];
        const result = await combine(input);

        expect(result).toEqual(fail(['error1', 'error2']));
      });
    });
  });

  describe('when input is an object', () => {
    describe('when all results are successful', () => {
      it('should return a Success with an object of values', () => {
        const input = {
          a: succeed(1),
          b: succeed('hello'),
          c: succeed(true),
        };
        const result = combine(input);

        expect(result).toEqual(succeed({ a: 1, b: 'hello', c: true }));
      });
    });

    describe('when some results are failures', () => {
      it('should return a Failure with an array of errors', () => {
        const input = {
          a: succeed(1),
          b: fail('error1'),
          c: fail('error2'),
        };
        const result = combine(input);

        expect(result).toEqual(fail(['error1', 'error2']));
      });
    });

    describe('when all results are failures', () => {
      it('should return a Failure with an array of all errors', () => {
        const input = {
          a: fail('error1'),
          b: fail('error2'),
          c: fail('error3'),
        };
        const result = combine(input);

        expect(result).toEqual(fail(['error1', 'error2', 'error3']));
      });
    });

    describe('when object is empty', () => {
      it('should return a Success with an empty object', () => {
        const input = {};
        const result = combine(input);

        expect(result).toEqual(succeed({}));
      });
    });

    describe('when input contains async results', () => {
      it('should handle async successful results', async () => {
        const input = {
          a: succeed(Promise.resolve(1)),
          b: succeed(Promise.resolve('hello')),
          c: succeed(Promise.resolve(true)),
        };
        const result = await combine(input);

        expect(result).toEqual(succeed({ a: 1, b: 'hello', c: true }));
      });

      it('should handle mixed sync and async successful results', async () => {
        const input = {
          a: succeed(1),
          b: succeed(Promise.resolve('hello')),
          c: succeed(true),
        };
        const result = await combine(input);

        expect(result).toEqual(succeed({ a: 1, b: 'hello', c: true }));
      });

      it('should handle async failures', async () => {
        const input = {
          a: succeed(Promise.resolve(1)),
          b: fail(Promise.resolve('error1')),
          c: fail(Promise.resolve('error2')),
        };
        const result = await combine(input);

        expect(result).toEqual(fail(['error1', 'error2']));
      });
    });
  });
});
