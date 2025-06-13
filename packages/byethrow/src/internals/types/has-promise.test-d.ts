import { describe, expectTypeOf, it } from 'vitest';

import type { HasPromise } from './has-promise';

describe('HasPromise', () => {
  it('should return true for a Promise type', () => {
    type Type = HasPromise<Promise<number>>;

    expectTypeOf<Type>().toEqualTypeOf<true>();
  });

  it('should return true if one of the union types is a Promise', () => {
    type Type = HasPromise<Promise<number> | number>;

    expectTypeOf<Type>().toEqualTypeOf<true>();
  });

  it('should return false for a non-Promise type', () => {
    type Type = HasPromise<number>;

    expectTypeOf<Type>().toEqualTypeOf<false>();
  });

  it('should return false for an empty object type', () => {
    type Type = HasPromise<{}>;

    expectTypeOf<Type>().toEqualTypeOf<false>();
  });

  it('should return false for an empty array type', () => {
    type Type = HasPromise<[]>;

    expectTypeOf<Type>().toEqualTypeOf<false>();
  });
});
