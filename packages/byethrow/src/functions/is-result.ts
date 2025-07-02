import type { Result } from '../result';

/**
 * Type guard to check if a value is a {@link Result}.
 *
 * @function
 * @typeParam T - The type of the success value.
 * @typeParam E - The type of the error value.
 * @param result - The value to check.
 * @returns `true` if the value is a {@link Result}, otherwise `false`.
 *
 * @example
 * ```ts
 * import { Result } from '@praha/byethrow';
 *
 * const value: unknown = { type: 'Success', value: 42 };
 * if (Result.isResult(value)) {
 *   // value is now typed as Result<unknown, unknown>
 *   console.log(value.type); // 'Success' or 'Failure'
 * }
 * ```
 *
 * @category Type Guards
 */
export const isResult = <T, E>(result: unknown): result is Result<T, E> => {
  return (
    typeof result === 'object'
    && result !== null
    && 'type' in result
    && ((result.type === 'Success' && 'value' in result) || (result.type === 'Failure' && 'error' in result))
  );
};
