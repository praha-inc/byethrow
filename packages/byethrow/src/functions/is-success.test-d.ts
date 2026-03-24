import { describe, expectTypeOf, it } from 'vitest';

import { fail } from './fail';
import { isSuccess } from './is-success';
import { succeed } from './succeed';

import type { Success } from '../result';

describe('isSuccess', () => {
  it('should narrow the type to Success when given a successful Result', () => {
    const result = succeed('value');
    if (isSuccess(result)) {
      expectTypeOf(result).toEqualTypeOf<Success<'value'>>();
    }
  });

  it('should not narrow the type to Success when given a failed Result', () => {
    const result = fail('error');
    if (isSuccess(result)) {
      expectTypeOf(result).toEqualTypeOf<Success<never>>();
    }
  });

  it('should narrow the type to Failure when the error type is a union', () => {
    // eslint-disable-next-line unicorn/consistent-function-scoping
    const fn = () => {
      return 0.5 < Math.random() ? succeed({ type: 'ok' }) : succeed('ok');
    };

    const result = fn();
    if (isSuccess(result)) {
      expectTypeOf(result).toEqualTypeOf<Success<'ok'> | Success<{ readonly type: 'ok' }>>();
    }
  });
});
