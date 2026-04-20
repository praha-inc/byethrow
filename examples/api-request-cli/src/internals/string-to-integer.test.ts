import { describe, expect, it } from 'vitest';

import { stringToInteger } from './string-to-integer';

describe('stringToInteger', () => {
  it('should parse a valid integer string', () => {
    const result = stringToInteger('123');

    expect(result).toBeSuccess((value) => {
      expect(value).toBe(123);
    });
  });

  it('should fail for a non-numeric string', () => {
    const result = stringToInteger('abc');

    expect(result).toBeFailure((value) => {
      expect(value).toBeInstanceOf(TypeError);
    });
  });

  it('should fail for a non-integer numeric string', () => {
    const result = stringToInteger('123.45');

    expect(result).toBeFailure((value) => {
      expect(value).toBeInstanceOf(TypeError);
    });
  });
});
