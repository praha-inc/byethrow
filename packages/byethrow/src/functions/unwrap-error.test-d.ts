import { describe, it, expectTypeOf } from 'vitest';

import { fail } from './fail';
import { unwrapError } from './unwrap-error';

describe('unwrapError', () => {
  it('should unwrap the error value from a failure result', () => {
    const result = fail('error');
    const value = unwrapError(result);

    expectTypeOf(value).toEqualTypeOf<string>();
  });

  it('should unwrap the value from an async failure result', () => {
    const result = fail(Promise.resolve('error'));
    const value = unwrapError(result);

    expectTypeOf(value).toEqualTypeOf<Promise<string>>();
  });
});
