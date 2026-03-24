import type { Result, Success } from '../result';

/**
 * Type guard to check if a {@link Result} is a {@link Success}.
 *
 * @function
 * @typeParam R - The type of the result to check.
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
 *
 * @category Type Guards
 */
export const isSuccess = <R extends Result<unknown, unknown>>(result: R): result is Extract<R, { readonly type: 'Success' }> => {
  return result.type === 'Success';
};
