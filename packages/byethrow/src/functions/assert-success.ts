/* eslint-disable @typescript-eslint/no-explicit-any */

import { isFailure } from './is-failure';
import { isPromise } from '../internals/helpers/is-promise';

import type { InferSuccess, Result, ResultAsync, Success } from '../result';

/**
 * Asserts that a {@link Result} or {@link ResultAsync} is a {@link Success} and returns it.
 * If the result is a {@link Failure}, throws an error.
 *
 * @function
 * @typeParam T - The type of the success value.
 * @param result - The {@link Result} or {@link ResultAsync} to assert as a {@link Success}.
 * @returns The {@link Success} result or a Promise of {@link Success} result.
 * @throws {Error} If the result is a {@link Failure}.
 *
 * @example
 * ```ts
 * import { Result } from '@praha/byethrow';
 *
 * const result = Result.succeed(42);
 * const success = Result.assertSuccess(result);
 * // success: { type: 'Success', value: 42 }
 * ```
 *
 * @example Throws on Failure
 * ```ts
 * // @errors: 2769
 * import { Result } from '@praha/byethrow';
 *
 * const result = Result.fail('error');
 * Result.assertSuccess(result); // throws Error
 * ```
 *
 * @example Safe unwrap with assertSuccess
 * ```ts
 * import { Result } from '@praha/byethrow';
 *
 * const getResult = (): Result.Result<number, string> => Result.succeed(42);
 * const value = Result.pipe(
 *   getResult(),
 *   Result.orElse(() => Result.succeed('fallback')),
 *   Result.assertSuccess,
 *   Result.unwrap(), // Safe unwrap after assertion
 * );
 * ```
 *
 * @see {@link unwrap} - Use with `assertSuccess` to safely unwrap success values.
 *
 * @category Assertions
 */
export const assertSuccess: {
  <R extends ResultAsync<any, never>>(result: R): Promise<Success<InferSuccess<R>>>;
  <R extends Result<any, never>>(result: R): Success<InferSuccess<R>>;
} = <T>(result: Result<T, never> | ResultAsync<T, never>): any => {
  const apply = (r: Result<T, never>): Success<T> => {
    if (isFailure(r)) {
      throw new Error('Expected a Success result, but received a Failure');
    }
    return r;
  };

  return isPromise(result) ? result.then(apply) : apply(result);
};
