/* oxlint-disable @typescript-eslint/no-explicit-any,@typescript-eslint/no-unsafe-return,@typescript-eslint/no-unsafe-assignment */

import type { Result } from '../result';

/**
 * Creates a {@link Failure} result from a given error.
 * Unlike {@link fail}, this function does NOT unwrap Promises.
 * The error is always wrapped as-is, and the return type is always a synchronous {@link Result}.
 *
 * This makes `failSync` safe to use inside generic functions where the type parameter `E`
 * is unresolved, avoiding the deferred conditional type issue with {@link fail}.
 *
 * @function
 * @typeParam E - The type of the error to wrap.
 * @returns A synchronous {@link Result} containing the error.
 *
 * @example Basic Usage
 * ```ts
 * import { Result } from '@praha/byethrow';
 *
 * const result = Result.failSync('Something went wrong');
 * // Result.Result<never, 'Something went wrong'>
 * ```
 *
 * @example Inside a Generic Function
 * ```ts
 * import { Result } from '@praha/byethrow';
 *
 * function wrapError<E>(error: E): Result.Result<never, E> {
 *   return Result.failSync(error);
 * }
 * ```
 *
 * @example With No Value
 * ```ts
 * import { Result } from '@praha/byethrow';
 *
 * const result = Result.failSync();
 * // Result.Result<never, void>
 * ```
 *
 * @see {@link fail} - For automatic Promise detection (not suitable for generic contexts).
 *
 * @category Creators
 */
export const failSync: {
  (): Result<never, void>;
  <const E>(error: E): Result<never, E>;
} = (...args: any[]) => {
  if (args.length <= 0) {
    return { type: 'Failure', error: undefined } as any;
  }
  return { type: 'Failure', error: args[0] } as any;
};
