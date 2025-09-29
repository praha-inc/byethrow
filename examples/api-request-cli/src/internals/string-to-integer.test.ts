import { Result } from '@praha/byethrow';
import { describe, expect, it } from 'vitest';

import { stringToInteger } from './string-to-integer';

describe('stringToInteger', () => {
  it('should parse a valid integer string', () => {
    const result = Result.unwrap(stringToInteger('123'));

    expect(result).toBe(123);
  });

  it('should fail for a non-numeric string', () => {
    const result = Result.unwrapError(stringToInteger('abc'));

    expect(result).toBeInstanceOf(TypeError);
  });

  it('should fail for a non-integer numeric string', () => {
    const result = Result.unwrapError(stringToInteger('123.45'));

    expect(result).toBeInstanceOf(TypeError);
  });
});
