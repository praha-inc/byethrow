import { describe, expect, it } from 'vitest';

import { fail } from './fail';
import { isSuccess } from './is-success';
import { succeed } from './succeed';

describe('isSuccess', () => {
  it('should return true for a successful result', () => {
    const result = succeed('value');

    expect(isSuccess(result)).toBe(true);
  });

  it('should return false for an error result', () => {
    const result = fail('value');

    expect(isSuccess(result)).toBe(false);
  });
});
