import { describe, it, expectTypeOf } from 'vitest';

import { fail } from './fail';
import { unwrapError } from './unwrap-error';

describe('unwrapError', () => {
  it('should unwrap the error value from a failed result', () => {
    const result = fail('error');
    const value = unwrapError(result);

    expectTypeOf(value).toEqualTypeOf<string>();
  });
});
