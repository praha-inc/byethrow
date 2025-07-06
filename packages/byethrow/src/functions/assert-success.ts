import { isFailure } from './is-failure';

import type { Result, Success } from '../result';

/**
 * Asserts that a {@link Result} is a {@link Success} and returns it.
 * If the result is a {@link Failure}, throws an error.
 *
 * @function
 * @typeParam T - The type of the success value.
 * @param result - The {@link Result} to assert as a {@link Success}.
 * @returns The {@link Success} result.
 * @throws {Error} If the result is a {@link Failure}.
 *
 * @example
 * ```ts
 * import { Result } from '@praha/byethrow';
 *
 * const result: Result.Result<number, string> = Result.succeed(42);
 * const success = Result.assertSuccess(result);
 * // success: { type: 'Success', value: 42 }
 * ```
 *
 * @example Throws on Failure
 * ```ts
 * import { Result } from '@praha/byethrow';
 *
 * const result: Result.Result<number, string> = Result.fail('error');
 * Result.assertSuccess(result); // throws Error
 * ```
 *
 * @example Safe unwrap with assertSuccess
 * ```ts
 * import { Result } from '@praha/byethrow';
 *
 * const result: Result.Result<string, string> = getResult();
 * const value = Result.pipe(
 *   result,
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
export const assertSuccess = <T>(result: Result<T, never>): Success<T> => {
  if (isFailure(result)) {
    throw new Error('Expected a Success result, but received a Failure');
  }
  return result;
};
