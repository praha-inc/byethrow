/* eslint-disable @typescript-eslint/no-explicit-any,@typescript-eslint/no-unsafe-return */

import { isSuccess } from './is-success';

import type { HasPromise } from '../internals/types/has-promise';
import type { InferFailure, ResultMaybeAsync } from '../result';

/**
 * Extracts the error value from a {@link Result}, {@link ResultAsync}.
 *
 * If the result is a {@link Success}, it throws the success value (this is rare but symmetric to `unwrap`).
 * For {@link ResultAsync}, it returns a Promise that resolves to the error value or rejects with the success value.
 *
 * @function
 * @typeParam R - The type of the result to unwrap.
 * @param result - The {@link Result}, {@link ResultAsync}.
 * @returns The error value, or a Promise of the error value for async results.
 * @throws The success value if the result is a {@link Success}.
 *
 * @example Failure Case
 * ```ts
 * import { Result } from '@praha/byethrow';
 *
 * const result: Result.Result<number, string> = Result.fail('Oops');
 * const error = Result.unwrapError(result); // 'Oops'
 * ```
 *
 * @example Success Case
 * ```ts
 * import { Result } from '@praha/byethrow';
 *
 * const result: Result.Result<number, string> = Result.succeed(100);
 * const error = Result.unwrapError(result); // throws 100
 * ```
 *
 * @example Async Failure Case
 * ```ts
 * import { Result } from '@praha/byethrow';
 *
 * const result: Result.Result<number, string> = Result,fail(Promise.resolve('Oops'));
 * const error = Result.unwrapError(result); // 'Oops'
 * ```
 *
 * @example Async Success Case
 * ```ts
 * import { Result } from '@praha/byethrow';
 *
 * const result: Result.Result<number, string> = Result.succeed(Promise.resolve(100));
 * const error = Result.unwrapError(result); // throws 100
 * ```
 *
 * @category Unwraps
 */
export const unwrapError = <R extends ResultMaybeAsync<any, any>>(
  result: R,
): true extends HasPromise<R> ? Promise<InferFailure<R>> : InferFailure<R> => {
  if (result instanceof Promise) {
    return result.then((r) => {
      if (isSuccess(r)) {
        throw r.value;
      }
      return r.error;
    }) as any;
  }

  if (isSuccess(result)) {
    throw result.value;
  }
  return result.error;
};
