import { describe, it, expect } from 'vitest';

import { fail } from './fail';
import { succeed } from './succeed';
import { unwrap } from './unwrap';

describe('unwrap', () => {
  it('should return the value if result is success', () => {
    const result = succeed('success');
    const value = unwrap(result);

    expect(value).toBe('success');
  });

  it('should throw an error if result is failure', () => {
    const result = fail('error');

    expect(() => unwrap(result)).toThrow('error');
  });
});
