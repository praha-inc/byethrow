import { describe, expect, it } from 'vitest';

import { fail } from './fail';
import { sequence } from './sequence';
import { succeed } from './succeed';

describe('sequence', () => {
  describe('when processing an object of Results', () => {
    describe('when all results are successful', () => {
      it('should return a Success with an object of values', () => {
        const result = sequence({
          a: succeed(1),
          b: succeed('hello'),
          c: succeed(true),
        });

        expect(result).toEqual(succeed({ a: 1, b: 'hello', c: true }));
      });
    });

    describe('when some results are failures', () => {
      it('should return a Failure with only the first error', () => {
        const result = sequence({
          a: succeed(1),
          b: fail('error1'),
          c: fail('error2'),
        });

        expect(result).toEqual(fail('error1'));
      });
    });

    describe('when all results are failures', () => {
      it('should return a Failure with only the first error', () => {
        const result = sequence({
          a: fail('error1'),
          b: fail('error2'),
          c: fail('error3'),
        });

        expect(result).toEqual(fail('error1'));
      });
    });

    describe('when object is empty', () => {
      it('should return a Success with an empty object', () => {
        const result = sequence({});

        expect(result).toEqual(succeed({}));
      });
    });

    describe('when some Results are asynchronous', () => {
      it('should handle async successful results', async () => {
        const result = await sequence({
          a: succeed(Promise.resolve(1)),
          b: succeed(Promise.resolve('hello')),
          c: succeed(Promise.resolve(true)),
        });

        expect(result).toEqual(succeed({ a: 1, b: 'hello', c: true }));
      });

      it('should handle mixed sync and async successful results', async () => {
        const result = await sequence({
          a: succeed(1),
          b: succeed(Promise.resolve('hello')),
          c: succeed(true),
        });

        expect(result).toEqual(succeed({ a: 1, b: 'hello', c: true }));
      });

      it('should stop at first async failure', async () => {
        const result = await sequence({
          a: succeed(Promise.resolve(1)),
          b: fail(Promise.resolve('error1')),
          c: fail(Promise.resolve('error2')),
        });

        expect(result).toEqual(fail('error1'));
      });
    });
  });

  describe('when processing an array of Results', () => {
    describe('when all results are successful', () => {
      it('should return a Success with an array of values', () => {
        const result = sequence([
          succeed(1),
          succeed(2),
          succeed(3),
        ]);

        expect(result).toEqual(succeed([1, 2, 3]));
      });
    });

    describe('when some results are failures', () => {
      it('should return a Failure with only the first error', () => {
        const result = sequence([
          succeed(1),
          fail('error1'),
          fail('error2'),
        ]);

        expect(result).toEqual(fail('error1'));
      });
    });

    describe('when all results are failures', () => {
      it('should return a Failure with only the first error', () => {
        const result = sequence([
          fail('error1'),
          fail('error2'),
          fail('error3'),
        ]);

        expect(result).toEqual(fail('error1'));
      });
    });

    describe('when array is empty', () => {
      it('should return a Success with an empty array', () => {
        const result = sequence([]);

        expect(result).toEqual(succeed([]));
      });
    });

    describe('when some Results are asynchronous', () => {
      it('should handle async successful results', async () => {
        const result = await sequence([
          succeed(Promise.resolve(1)),
          succeed(Promise.resolve(2)),
          succeed(Promise.resolve(3)),
        ]);

        expect(result).toEqual(succeed([1, 2, 3]));
      });

      it('should handle mixed sync and async successful results', async () => {
        const result = await sequence([
          succeed(1),
          succeed(Promise.resolve(2)),
          succeed(3),
        ]);

        expect(result).toEqual(succeed([1, 2, 3]));
      });

      it('should stop at first async failure', async () => {
        const result = await sequence([
          succeed(Promise.resolve(1)),
          fail(Promise.resolve('error1')),
          fail(Promise.resolve('error2')),
        ]);

        expect(result).toEqual(fail('error1'));
      });
    });
  });

  describe('when processing an array with a mapping function', () => {
    describe('when all results are successful', () => {
      it('should return a Success with an array of mapped values', () => {
        const result = sequence(['1', '2', '3'], (value) => {
          const number = Number(value);
          return Number.isNaN(number)
            ? fail(`Invalid number: ${value}`)
            : succeed(number);
        });

        expect(result).toEqual(succeed([1, 2, 3]));
      });
    });

    describe('when some results are failures', () => {
      it('should return a Failure with only the first error', () => {
        const result = sequence(['1', 'invalid', '3'], (value) => {
          const number = Number(value);
          return Number.isNaN(number)
            ? fail(`Invalid number: ${value}`)
            : succeed(number);
        });

        expect(result).toEqual(fail('Invalid number: invalid'));
      });
    });

    describe('when mapper function returns async results', () => {
      it('should handle async successful results', async () => {
        const result = await sequence(['1', '2', '3'], (value) => {
          const number = Number(value);
          return Number.isNaN(number)
            ? fail(Promise.resolve(`Invalid number: ${value}`))
            : succeed(Promise.resolve(number));
        });

        expect(result).toEqual(succeed([1, 2, 3]));
      });

      it('should stop at first async failure', async () => {
        const result = await sequence(['1', 'invalid', '3'], (value) => {
          const number = Number(value);
          return Number.isNaN(number)
            ? fail(Promise.resolve(`Invalid number: ${value}`))
            : succeed(Promise.resolve(number));
        });

        expect(result).toEqual(fail('Invalid number: invalid'));
      });
    });
  });
});
