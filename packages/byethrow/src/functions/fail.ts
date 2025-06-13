/* eslint-disable @typescript-eslint/no-explicit-any,@typescript-eslint/no-unsafe-return */

import { isPromise } from '../internals/helpers/is-promise';

import type { ResultFor } from '../result';

/**
 * Creates a {@link Failure} result from a given error.
 * Automatically wraps the error in a `Promise` if it is asynchronous.
 *
 * @function
 * @typeParam E - The type of the error to wrap.
 * @returns A {@link Result} or {@link ResultAsync} depending on whether the input is a promise.
 *
 * @example Synchronous Usage
 * ```ts
 * import { Result } from '@praha/byethrow';
 *
 * const result = Result.fail('Something went wrong');
 * // Result.Result<never, string>
 * ```
 *
 * @example Asynchronous Usage
 * ```ts
 * import { Result } from '@praha/byethrow';
 *
 * const result = Result.fail(Promise.resolve('Async error'));
 * // Result.ResultAsync<never, string>
 * ```
 */
export const fail = <E>(error: E): ResultFor<E, never, Awaited<E>> => {
  if (isPromise(error)) {
    return error.then((error) => ({ type: 'Failure', error: error })) as any;
  }
  return { type: 'Failure', error } as any;
};
