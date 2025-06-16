import { describe, expect, it } from 'vitest';

import { fail } from './fail';
import { isFailure } from './is-failure';
import { succeed } from './succeed';

describe('isFailure', () => {
  it('should return true for a successful result', () => {
    const result = succeed('value');

    expect(isFailure(result)).toBe(false);
  });

  it('should return false for an error result', () => {
    const result = fail('value');

    expect(isFailure(result)).toBe(true);
  });
});
