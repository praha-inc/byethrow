import { describe, expect, it } from 'vitest';

import { succeedSync } from './succeed-sync';

describe('succeedSync', () => {
  it('should create a Success object with the provided value', () => {
    const value = { id: '123', name: 'test' };
    const result = succeedSync(value);

    expect(result).toEqual({
      type: 'Success',
      value,
    });
  });

  it('should create a Success object with a no value', () => {
    const result = succeedSync();

    expect(result).toEqual({
      type: 'Success',
    });
  });

  it('should create a Success object with undefined value', () => {
    const result = succeedSync(undefined);

    expect(result).toEqual({
      type: 'Success',
      value: undefined,
    });
  });

  it('should NOT unwrap a Promise value', () => {
    const promise = Promise.resolve(42);
    const result = succeedSync(promise);

    expect(result).toEqual({
      type: 'Success',
      value: promise,
    });
  });
});
