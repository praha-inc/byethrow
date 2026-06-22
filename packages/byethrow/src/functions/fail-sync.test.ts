import { describe, expect, it } from 'vitest';

import { failSync } from './fail-sync';

describe('failSync', () => {
  it('should create a Failure object with the provided error', () => {
    const error = new Error('Test error');
    const result = failSync(error);

    expect(result).toEqual({
      type: 'Failure',
      error,
    });
  });

  it('should create a Failure object with a no value', () => {
    const result = failSync();

    expect(result).toEqual({
      type: 'Failure',
    });
  });

  it('should create a Failure object with undefined value', () => {
    const result = failSync(undefined);

    expect(result).toEqual({
      type: 'Failure',
      error: undefined,
    });
  });

  it('should NOT unwrap a Promise error', () => {
    const promise = Promise.resolve(new Error('Test error'));
    const result = failSync(promise);

    expect(result).toEqual({
      type: 'Failure',
      error: promise,
    });
  });
});
