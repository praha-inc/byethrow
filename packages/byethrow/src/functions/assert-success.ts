/* eslint-disable @typescript-eslint/no-explicit-any */

import { isFailure } from './is-failure';
import { isPromise } from '../internals/helpers/is-promise';

import type { HasPromise } from '../internals/types/has-promise';
import type { InferSuccess, Result, ResultMaybeAsync, Success } from '../result';

/**
 * Asserts that a {@link Result} or {@link ResultAsync} is a {@link Success} and returns it.
 * This function requires that the result's error type is `never`, meaning the result is
 * guaranteed to be a {@link Success} at the type level.
 * If the result is a {@link Failure} at runtime, throws an error.
 *
 * @function
 * @typeParam R - The result type that extends {@link ResultMaybeAsync} with `never` as the error type.
 * @param result - The {@link Result} or {@link ResultAsync} to assert as a {@link Success}.
 *                 The error type must be `never`.
 * @returns The {@link Success} result or a Promise of {@link Success} result.
 * @throws {Error} If the result is a {@link Failure} at runtime.
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
 * @example Type-safe usage after narrowing error type
 * ```ts
 * import { Result } from '@praha/byethrow';
 *
 * const getResult = (): Result.Result<number, string> => Result.succeed(42);
 * const value = Result.pipe(
 *   getResult(),
 *   Result.orElse(() => Result.succeed(0)), // Error type becomes never
 *   Result.assertSuccess, // Type-safe: error type is now never
 *   Result.unwrap(), // Safe unwrap after assertion
 * );
 * ```
 *
 * @see {@link unwrap} - Use with `assertSuccess` to safely unwrap success values.
 *
 * @category Assertions
 */
export const assertSuccess = <R extends ResultMaybeAsync<any, never>>(
  result: R,
): true extends HasPromise<R> ? Promise<Success<InferSuccess<R>>> : Success<InferSuccess<R>> => {
  const apply = (r: Result<InferSuccess<R>, never>): Success<InferSuccess<R>> => {
    if (isFailure(r)) {
      throw new Error('Expected a Success result, but received a Failure');
    }
    return r;
  };

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return (isPromise(result) ? result.then(apply) : apply(result)) as any;
};
