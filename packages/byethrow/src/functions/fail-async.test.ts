import { describe, expect, it } from 'vitest';

import { failAsync } from './fail-async';

describe('failAsync', () => {
  it('should create a Failure object from a Promise error', async () => {
    const result = await failAsync(Promise.resolve(new Error('Test error')));

    expect(result).toEqual({
      type: 'Failure',
      error: new Error('Test error'),
    });
  });

  it('should create a Failure object from a Promise of a string', async () => {
    const result = await failAsync(Promise.resolve('async error'));

    expect(result).toEqual({
      type: 'Failure',
      error: 'async error',
    });
  });
});
