/* eslint-disable @typescript-eslint/no-explicit-any,@typescript-eslint/no-unsafe-return,@typescript-eslint/no-unsafe-assignment */

import { isPromise } from '../internals/helpers/is-promise';

import type { ResultFor } from '../result';

/**
 * Creates a {@link Success} result from a given value.
 * Automatically wraps the value in a `Promise` if it is asynchronous.
 *
 * @function
 * @typeParam T - The type of the value to wrap.
 * @returns A {@link Result} or {@link ResultAsync} depending on whether the input is a promise.
 *
 * @example Synchronous Usage
 * ```ts
 * import { Result } from '@praha/byethrow';
 *
 * const result = Result.succeed(42);
 * // Result.Result<number, never>
 * ```
 *
 * @example Asynchronous Usage
 * ```ts
 * import { Result } from '@praha/byethrow';
 *
 * const result = Result.succeed(Promise.resolve(42));
 * // Result.ResultAsync<number, never>
 * ```
 *
 * @example With No Value
 * ```ts
 * import { Result } from '@praha/byethrow';
 *
 * const result = Result.succeed();
 * // Result.Result<void, never>
 * ```
 *
 * @category Creators
 */
export const succeed: {
  (): ResultFor<never, void, never>;
  <T>(value: T): ResultFor<T, Awaited<T>, never>;
} = (...args: any[]) => {
  const value = args[0];
  if (value === undefined) {
    return { type: 'Success' };
  }

  if (isPromise(value)) {
    return value.then((value) => ({ type: 'Success', value: value }));
  }
  return { type: 'Success', value } as any;
};
