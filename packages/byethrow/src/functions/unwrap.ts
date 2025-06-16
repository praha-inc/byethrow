import { isFailure } from './is-failure';

import type { Result } from '../result';

/**
 * Extracts the success value from a {@link Result}.
 *
 * If the result is a {@link Failure}, it throws the contained error.
 *
 * @function
 * @typeParam T - The type of the success value.
 * @param result - The {@link Result} to unwrap.
 * @returns The success value.
 * @throws The error value if the result is a {@link Failure}.
 *
 * @example Success Case
 * ```ts
 * import { Result } from '@praha/byethrow';
 *
 * const result: Result.Result<number, string> = { type: 'Success', value: 100 };
 * const value = Result.unwrap(result); // 100
 * ```
 *
 * @example Failure Case
 * ```ts
 * import { Result } from '@praha/byethrow';
 *
 * const result: Result.Result<number, string> = { type: 'Failure', error: 'Oops' };
 * const value = Result.unwrap(result); // throws 'Oops'
 * ```
 *
 * @category Unwraps
 */
export const unwrap = <T>(result: Result<T, unknown>): T => {
  if (isFailure(result)) {
    throw result.error;
  }
  return result.value;
};
