import { describe, it, expectTypeOf } from 'vitest';

import { succeed } from './succeed';
import { unwrap } from './unwrap';

describe('unwrap', () => {
  it('should unwrap the value from a success result', () => {
    const result = succeed('success');
    const value = unwrap(result);

    expectTypeOf(value).toEqualTypeOf<string>();
  });
});
