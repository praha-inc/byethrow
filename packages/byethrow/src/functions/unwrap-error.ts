import { isSuccess } from './is-success';

import type { Result } from '../result';

/**
 * Extracts the error value from a {@link Result}.
 *
 * If the result is a {@link Success}, it throws the success value (this is rare but symmetric to `unwrap`).
 *
 * @function
 * @typeParam E - The type of the error value.
 * @param result - The {@link Result} to unwrap the error from.
 * @returns The error value.
 * @throws The success value if the result is a {@link Success}.
 *
 * @example Failure Case
 * ```ts
 * import { Result } from '@praha/byethrow';
 *
 * const result: Result.Result<number, string> = { type: 'Failure', error: 'Something went wrong' };
 * const error = Result.unwrapError(result); // 'Something went wrong'
 * ```
 *
 * @example Success Case
 * ```ts
 * import { Result } from '@praha/byethrow';
 *
 * const result: Result.Result<number, string> = { type: 'Success', value: 123 };
 * const error = Result.unwrapError(result); // throws 123
 * ```
 *
 * @category Unwraps
 */
export const unwrapError = <E>(result: Result<unknown, E>): E => {
  if (isSuccess(result)) {
    throw result.value;
  }
  return result.error;
};
