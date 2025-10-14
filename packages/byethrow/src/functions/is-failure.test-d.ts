import { describe, expectTypeOf, it } from 'vitest';

import { fail } from './fail';
import { isFailure } from './is-failure';
import { succeed } from './succeed';

import type { Failure } from '../result';

describe('isFailure', () => {
  it('should not narrow the type to Failure when given a successful Result', () => {
    const result = succeed('value');
    if (isFailure(result)) {
      expectTypeOf(result).toEqualTypeOf<Failure<never>>();
    }
  });

  it('should narrow the type to Failure when given a failed Result', () => {
    const result = fail('error');
    if (isFailure(result)) {
      expectTypeOf(result).toEqualTypeOf<Failure<'error'>>();
    }
  });
});
