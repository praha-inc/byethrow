import { describe, it, expect } from 'vitest';

import { fail } from './fail';
import { succeed } from './succeed';
import { unwrapError } from './unwrap-error';

describe('unwrapError', () => {
  it('should return the value if result is failure', () => {
    const result = fail('error');
    const value = unwrapError(result);

    expect(value).toBe('error');
  });

  it('should throw an error if result is success', () => {
    const result = succeed('success');

    expect(() => unwrapError(result)).toThrow('success');
  });
});
