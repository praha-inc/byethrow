import { describe, expect, it } from 'vitest';

import { succeedAsync } from './succeed-async';

describe('succeedAsync', () => {
  it('should create a Success object from a Promise value', async () => {
    const result = await succeedAsync(Promise.resolve(42));

    expect(result).toEqual({
      type: 'Success',
      value: 42,
    });
  });

  it('should create a Success object from a Promise of an object', async () => {
    const result = await succeedAsync(Promise.resolve({ id: '123', name: 'test' }));

    expect(result).toEqual({
      type: 'Success',
      value: { id: '123', name: 'test' },
    });
  });
});
