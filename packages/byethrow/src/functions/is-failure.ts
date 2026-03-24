import type { Failure, Result } from '../result';

/**
 * Type guard to check if a {@link Result} is a {@link Failure}.
 *
 * @function
 * @typeParam R - The type of the result to check.
 * @param result - The {@link Result} to check.
 * @returns `true` if the result is a {@link Failure}, otherwise `false`.
 *
 * @example
 * ```ts
 * import { Result } from '@praha/byethrow';
 *
 * const result: Result.Result<number, string> = { type: 'Failure', error: 'Something went wrong' };
 * if (Result.isFailure(result)) {
 *   console.error(result.error); // Safe access to error
 * }
 * ```
 *
 * @category Type Guards
 */
export const isFailure = <R extends Result<unknown, unknown>>(result: R): result is Extract<R, { readonly type: 'Failure' }> => {
  return result.type === 'Failure';
};
