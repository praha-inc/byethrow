/* eslint-disable @typescript-eslint/no-explicit-any,@typescript-eslint/no-unsafe-return */

import { isFailure } from './is-failure';

import type { HasPromise } from '../internals/types/has-promise';
import type { InferSuccess, ResultMaybeAsync } from '../result';

/**
 * Extracts the success value from a {@link Result}, {@link ResultAsync}.
 *
 * If the result is a {@link Failure}, it throws the contained error.
 * For {@link ResultAsync}, it returns a Promise that resolves to the success value or rejects with the error.
 *
 * @function
 * @typeParam R - The type of the result to unwrap.
 * @param result - The {@link Result}, {@link ResultAsync}.
 * @returns The success value, or a Promise of the success value for async results.
 * @throws The error value if the result is a {@link Failure}.
 *
 * @example Success Case
 * ```ts
 * import { Result } from '@praha/byethrow';
 *
 * const result: Result.Result<number, string> = Result.succeed(100);
 * const value = Result.unwrap(result); // 100
 * ```
 *
 * @example Failure Case
 * ```ts
 * import { Result } from '@praha/byethrow';
 *
 * const result: Result.Result<number, string> = Result.fail('Oops');
 * const value = Result.unwrap(result); // throws 'Oops'
 * ```
 *
 * @example Async Success Case
 * ```ts
 * import { Result } from '@praha/byethrow';
 *
 * const result: Result.ResultAsync<number, string> = Result.succeed(Promise.resolve(100));
 * const value = await Result.unwrap(result); // 100
 * ```
 *
 * @example Async Failure Case
 * ```ts
 * import { Result } from '@praha/byethrow';
 *
 * const result: Result.ResultAsync<number, string> = Result.fail(Promise.resolve('Oops'));
 * const value = await Result.unwrap(result); // throws 'Oops'
 * ```
 *
 * @category Unwraps
 */
export const unwrap = <R extends ResultMaybeAsync<any, any>>(
  result: R,
): true extends HasPromise<R> ? Promise<InferSuccess<R>> : InferSuccess<R> => {
  if (result instanceof Promise) {
    return result.then((r) => {
      if (isFailure(r)) {
        throw r.error;
      }
      return r.value;
    }) as any;
  }

  if (isFailure(result)) {
    throw result.error;
  }
  return result.value;
};
