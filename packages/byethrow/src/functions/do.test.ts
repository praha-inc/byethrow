import { describe, expect, it } from 'vitest';

import { do as do_ } from './do';

describe('do', () => {
  it('should create a Success object with an empty value', () => {
    expect(do_()).toEqual({
      type: 'Success',
      value: {},
    });
  });
});
