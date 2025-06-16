import type { Result, Success } from '../result';

/**
 * Type guard to check if a {@link Result} is a {@link Success}.
 *
 * @function
 * @typeParam T - The type of the success value.
 * @param result - The {@link Result} to check.
 * @returns `true` if the result is a {@link Success}, otherwise `false`.
 *
 * @example
 * ```ts
 * import { Result } from '@praha/byethrow';
 *
 * const result: Result.Result<number, string> = { type: 'Success', value: 10 };
 * if (Result.isSuccess(result)) {
 *   console.log(result.value); // Safe access to value
 * }
 * ```
 */
export const isSuccess = <T>(result: Result<T, unknown>): result is Success<T> => {
  return result.type === 'Success';
};
