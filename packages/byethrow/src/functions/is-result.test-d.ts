import { describe, expectTypeOf, it } from 'vitest';

import { isResult } from './is-result';
import { succeed } from './succeed';

import type { Result } from '../result';

describe('isResult', () => {
  it('should narrow the type to Result', () => {
    const value: unknown = succeed('test');
    if (isResult(value)) {
      expectTypeOf(value).toEqualTypeOf<Result<unknown, unknown>>();
    }
  });

  it('should narrow the type to Result with specified generic types', () => {
    const value: unknown = succeed('test');
    if (isResult<number, string>(value)) {
      expectTypeOf(value).toEqualTypeOf<Result<number, string>>();
    }
  });
});
