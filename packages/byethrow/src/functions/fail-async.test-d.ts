import { describe, expectTypeOf, it } from 'vitest';

import { failAsync } from './fail-async';

import type { ResultAsync } from '../result';

describe('failAsync', () => {
  it('should return a ResultAsync when given a Promise', () => {
    const result = failAsync(Promise.resolve('error'));

    expectTypeOf(result).toEqualTypeOf<ResultAsync<never, string>>();
  });

  it('should return a ResultAsync with an Error object', () => {
    const result = failAsync(Promise.resolve(new Error('fail')));

    expectTypeOf(result).toEqualTypeOf<ResultAsync<never, Error>>();
  });
});
