/* eslint-disable @typescript-eslint/no-explicit-any,@typescript-eslint/no-unsafe-return,@typescript-eslint/no-unsafe-assignment */

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
 *
 * @example With No Value
 * ```ts
 * import { Result } from '@praha/byethrow';
 *
 * const result = Result.fail();
 * // Result.Result<never, void>
 * ```
 *
 * @see {@link combine} - For combining multiple Results into a single Result.
 *
 * @category Creators
 */
export const fail: {
  (): ResultFor<never, never, void>;
  <E>(error: E): ResultFor<E, never, Awaited<E>>;
} = (...args: any[]) => {
  const error = args[0];
  if (error === undefined) {
    return { type: 'Failure' };
  }

  if (isPromise(error)) {
    return error.then((error) => ({ type: 'Failure', error: error }));
  }
  return { type: 'Failure', error } as any;
};
