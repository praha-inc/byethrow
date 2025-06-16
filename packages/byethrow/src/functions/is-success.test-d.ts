import { describe, expectTypeOf, it } from 'vitest';

import { fail } from './fail';
import { isSuccess } from './is-success';
import { succeed } from './succeed';

import type { Success } from '../result';

describe('isSuccess', () => {
  it('should narrow the type to Success when given a successful Result', () => {
    const result = succeed('value');
    if (isSuccess(result)) {
      expectTypeOf(result).toEqualTypeOf<Success<string>>();
    }
  });

  it('should not narrow the type to Success when given a failed Result', () => {
    const result = fail('value');
    if (isSuccess(result)) {
      expectTypeOf(result).toEqualTypeOf<Success<never>>();
    }
  });
});
