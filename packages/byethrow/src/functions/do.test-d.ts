import { describe, expectTypeOf, it } from 'vitest';

import { do as do_ } from './do';

import type { Result } from '../result';

describe('do', () => {
  it('should match type Result with empty success and never failure', () => {
    expectTypeOf(do_()).toEqualTypeOf<Result<{}, never>>();
  });
});
