import { describe, expect, it } from 'vitest';

import { succeed } from './succeed';

describe('succeed', () => {
  it('should create a Success object with the provided value', () => {
    const value = { id: '123', name: 'test' };
    const result = succeed(value);

    expect(result).toEqual({
      type: 'Success',
      value,
    });
  });

  it('should return a Result when a Promise is passed', () => {
    const result = succeed(Promise.resolve(42));

    expect(result).toEqual({
      type: 'Success',
      value: Promise.resolve(42),
    });
  });

  it('should create a Success object with a no value', () => {
    const result = succeed();

    expect(result).toEqual({
      type: 'Success',
    });
  });

  it('should create a Success object with undefined value', () => {
    const result = succeed(undefined);

    expect(result).toEqual({
      type: 'Success',
      value: undefined,
    });
  });
});
