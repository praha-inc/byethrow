import { describe, expect, it } from 'vitest';

import { collect } from './collect';
import { fail } from './fail';
import { succeed } from './succeed';

describe('collect', () => {
  describe('when collecting an object of Results', () => {
    describe('when all results are successful', () => {
      it('should return a Success with an object of values', () => {
        const result = collect({
          a: succeed(1),
          b: succeed('hello'),
          c: succeed(true),
        });

        expect(result).toEqual(succeed({ a: 1, b: 'hello', c: true }));
      });
    });

    describe('when some results are failures', () => {
      it('should return a Failure with an array of errors', () => {
        const result = collect({
          a: succeed(1),
          b: fail('error1'),
          c: fail('error2'),
        });

        expect(result).toEqual(fail(['error1', 'error2']));
      });
    });

    describe('when all results are failures', () => {
      it('should return a Failure with an array of all errors', () => {
        const result = collect({
          a: fail('error1'),
          b: fail('error2'),
          c: fail('error3'),
        });

        expect(result).toEqual(fail(['error1', 'error2', 'error3']));
      });
    });

    describe('when object is empty', () => {
      it('should return a Success with an empty object', () => {
        const result = collect({});

        expect(result).toEqual(succeed({}));
      });
    });

    describe('when some Results are asynchronous', () => {
      it('should handle async successful results', async () => {
        const result = await collect({
          a: succeed(Promise.resolve(1)),
          b: succeed(Promise.resolve('hello')),
          c: succeed(Promise.resolve(true)),
        });

        expect(result).toEqual(succeed({ a: 1, b: 'hello', c: true }));
      });

      it('should handle mixed sync and async successful results', async () => {
        const result = await collect({
          a: succeed(1),
          b: succeed(Promise.resolve('hello')),
          c: succeed(true),
        });

        expect(result).toEqual(succeed({ a: 1, b: 'hello', c: true }));
      });

      it('should handle async failures', async () => {
        const result = await collect({
          a: succeed(Promise.resolve(1)),
          b: fail(Promise.resolve('error1')),
          c: fail(Promise.resolve('error2')),
        });

        expect(result).toEqual(fail(['error1', 'error2']));
      });
    });
  });

  describe('when collecting an array of Results', () => {
    describe('when all results are successful', () => {
      it('should return a Success with an array of values', () => {
        const result = collect([
          succeed(1),
          succeed(2),
          succeed(3),
        ]);

        expect(result).toEqual(succeed([1, 2, 3]));
      });
    });

    describe('when some results are failures', () => {
      it('should return a Failure with an array of errors', () => {
        const result = collect([
          succeed(1),
          fail('error1'),
          fail('error2'),
        ]);

        expect(result).toEqual(fail(['error1', 'error2']));
      });
    });

    describe('when all results are failures', () => {
      it('should return a Failure with an array of all errors', () => {
        const result = collect([
          fail('error1'),
          fail('error2'),
          fail('error3'),
        ]);

        expect(result).toEqual(fail(['error1', 'error2', 'error3']));
      });
    });

    describe('when array is empty', () => {
      it('should return a Success with an empty array', () => {
        const result = collect([]);

        expect(result).toEqual(succeed([]));
      });
    });

    describe('when some Results are asynchronous', () => {
      it('should handle async successful results', async () => {
        const result = await collect([
          succeed(Promise.resolve(1)),
          succeed(Promise.resolve(2)),
          succeed(Promise.resolve(3)),
        ]);

        expect(result).toEqual(succeed([1, 2, 3]));
      });

      it('should handle mixed sync and async successful results', async () => {
        const result = await collect([
          succeed(1),
          succeed(Promise.resolve(2)),
          succeed(3),
        ]);

        expect(result).toEqual(succeed([1, 2, 3]));
      });

      it('should handle async failures', async () => {
        const result = await collect([
          succeed(Promise.resolve(1)),
          fail(Promise.resolve('error1')),
          fail(Promise.resolve('error2')),
        ]);

        expect(result).toEqual(fail(['error1', 'error2']));
      });
    });
  });

  describe('when collecting an array with a mapping function', () => {
    describe('when all results are successful', () => {
      it('should return a Success with an array of mapped values', () => {
        const result = collect(['1', '2', '3'], (value) => {
          const number = Number(value);
          return Number.isNaN(number)
            ? fail(`Invalid number: ${value}`)
            : succeed(number);
        });

        expect(result).toEqual(succeed([1, 2, 3]));
      });
    });

    describe('when some results are failures', () => {
      it('should return a Failure with an array of errors', () => {
        const result = collect(['1', 'invalid', '3'], (value) => {
          const number = Number(value);
          return Number.isNaN(number)
            ? fail(`Invalid number: ${value}`)
            : succeed(number);
        });

        expect(result).toEqual(fail(['Invalid number: invalid']));
      });
    });

    describe('when mapper function returns async results', () => {
      it('should handle async successful results', async () => {
        const result = await collect(['1', '2', '3'], (value) => {
          const number = Number(value);
          return Number.isNaN(number)
            ? fail(Promise.resolve(`Invalid number: ${value}`))
            : succeed(Promise.resolve(number));
        });

        expect(result).toEqual(succeed([1, 2, 3]));
      });

      it('should handle async failures', async () => {
        const result = await collect(['1', 'invalid', '3'], (value) => {
          const number = Number(value);
          return Number.isNaN(number)
            ? fail(Promise.resolve(`Invalid number: ${value}`))
            : succeed(Promise.resolve(number));
        });

        expect(result).toEqual(fail(['Invalid number: invalid']));
      });
    });
  });
});
