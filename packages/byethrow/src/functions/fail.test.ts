import { describe, expect, it } from 'vitest';

import { fail } from './fail';

describe('fail', () => {
  it('should create a Failure object with the provided error', () => {
    const error = new Error('Test error');
    const result = fail(error);

    expect(result).toEqual({
      type: 'Failure',
      error,
    });
  });

  it('should create a Failure object with a Promise error', async () => {
    const error = Promise.resolve(new Error('Test promise error'));
    const result = await fail(error);

    expect(result).toEqual({
      type: 'Failure',
      error: new Error('Test promise error'),
    });
  });

  it('should create a Failure object with a no value', () => {
    const result = fail();

    expect(result).toEqual({
      type: 'Failure',
    });
  });

  it('should create a Failure object with undefined value', () => {
    // eslint-disable-next-line unicorn/no-useless-undefined
    const result = fail(undefined);

    expect(result).toEqual({
      type: 'Failure',
      error: undefined,
    });
  });
});
