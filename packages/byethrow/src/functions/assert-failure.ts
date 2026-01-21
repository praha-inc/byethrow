/* eslint-disable @typescript-eslint/no-explicit-any */

import { isSuccess } from './is-success';
import { isPromise } from '../internals/helpers/is-promise';

import type { HasPromise } from '../internals/types/has-promise';
import type { Failure, InferFailure, Result, ResultMaybeAsync } from '../result';

/**
 * Asserts that a {@link Result} or {@link ResultAsync} is a {@link Failure} and returns it.
 * This function requires that the result's success type is `never`, meaning the result is
 * guaranteed to be a {@link Failure} at the type level.
 * If the result is a {@link Success} at runtime, throws an error.
 *
 * @function
 * @typeParam R - The result type that extends {@link ResultMaybeAsync} with `never` as the success type.
 * @param result - The {@link Result} or {@link ResultAsync} to assert as a {@link Failure}.
 *                 The success type must be `never`.
 * @returns The {@link Failure} result or a Promise of {@link Failure} result.
 * @throws {Error} If the result is a {@link Success} at runtime.
 *
 * @example
 * ```ts
 * import { Result } from '@praha/byethrow';
 *
 * const result = Result.fail('error');
 * const failure = Result.assertFailure(result);
 * // failure: { type: 'Failure', error: 'error' }
 * ```
 *
 * @example Type-safe usage after narrowing success type
 * ```ts
 * import { Result } from '@praha/byethrow';
 *
 * const getResult = (): Result.Result<number, string> => Result.fail('error');
 * const value = Result.pipe(
 *   getResult(),
 *   Result.andThen(() => Result.fail('die')), // Success type becomes never
 *   Result.assertFailure, // Type-safe: success type is now never
 *   Result.unwrapError(), // Safe unwrap after assertion
 * );
 * ```
 *
 * @see {@link unwrapError} - Use with `assertFailure` to safely unwrap error values.
 *
 * @category Assertions
 */
export const assertFailure = <R extends ResultMaybeAsync<never, any>>(
  result: R,
): true extends HasPromise<R> ? Promise<Failure<InferFailure<R>>> : Failure<InferFailure<R>> => {
  const apply = (r: Result<never, InferFailure<R>>): Failure<InferFailure<R>> => {
    if (isSuccess(r)) {
      throw new Error('Expected a Failure result, but received a Success');
    }
    return r;
  };

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return (isPromise(result) ? result.then(apply) : apply(result)) as any;
};
