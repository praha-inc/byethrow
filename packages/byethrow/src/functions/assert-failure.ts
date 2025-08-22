/* eslint-disable @typescript-eslint/no-explicit-any */

import { isSuccess } from './is-success';
import { isPromise } from '../internals/helpers/is-promise';

import type { Failure, InferFailure, Result, ResultAsync } from '../result';

/**
 * Asserts that a {@link Result} or {@link ResultAsync} is a {@link Failure} and returns it.
 * If the result is a {@link Success}, throws an error.
 *
 * @function
 * @typeParam E - The type of the error value.
 * @param result - The {@link Result} or {@link ResultAsync} to assert as a {@link Failure}.
 * @returns The {@link Failure} result or a Promise of {@link Success} result.
 * @throws {Error} If the result is a {@link Success}.
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
 * @example Throws on Success
 * ```ts
 * // @errors: 2769
 * import { Result } from '@praha/byethrow';
 *
 * const result = Result.succeed(42);
 * Result.assertFailure(result); // throws Error
 * ```
 *
 * @example Safe unwrap with assertFailure
 * ```ts
 * import { Result } from '@praha/byethrow';
 *
 * const getResult = (): Result.Result<number, string> => Result.fail('error');
 * const value = Result.pipe(
 *   getResult(),
 *   Result.andThen(() => Result.fail('die')),
 *   Result.assertFailure,
 *   Result.unwrapError(), // Safe unwrap after assertion
 * );
 * ```
 *
 * @see {@link unwrapError} - Use with `assertFailure` to safely unwrap error values.
 *
 * @category Assertions
 */
export const assertFailure: {
  <R extends ResultAsync<never, any>>(result: R): Promise<Failure<InferFailure<R>>>;
  <R extends Result<never, any>>(result: R): Failure<InferFailure<R>>;
} = <E>(result: Result<never, E> | ResultAsync<never, E>): any => {
  const apply = (r: Result<never, E>): Failure<E> => {
    if (isSuccess(r)) {
      throw new Error('Expected a Failure result, but received a Success');
    }
    return r;
  };

  return isPromise(result) ? result.then(apply) : apply(result);
};
