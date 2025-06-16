import type { Failure, Result } from '../result';

/**
 * Type guard to check if a {@link Result} is a {@link Failure}.
 *
 * @function
 * @typeParam E - The type of the error value.
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
 */
export const isFailure = <E>(result: Result<unknown, E>): result is Failure<E> => {
  return result.type === 'Failure';
};
