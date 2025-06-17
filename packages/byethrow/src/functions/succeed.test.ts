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

  it('should create a Success object with a Promise value', async () => {
    const value = Promise.resolve({ id: '123', name: 'test' });
    const result = await succeed(value);

    expect(result).toEqual({
      type: 'Success',
      value: { id: '123', name: 'test' },
    });
  });

  it('should create a Success object with a no value', () => {
    const result = succeed();

    expect(result).toEqual({
      type: 'Success',
    });
  });
});
