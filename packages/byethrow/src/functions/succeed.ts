/* eslint-disable @typescript-eslint/no-explicit-any,@typescript-eslint/no-unsafe-return */

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
 */
export const succeed = <T>(value: T): ResultFor<T, Awaited<T>, never> => {
  if (isPromise(value)) {
    return value.then((value) => ({ type: 'Success', value: value })) as any;
  }
  return { type: 'Success', value } as any;
};
