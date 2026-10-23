/* oxlint-disable @typescript-eslint/no-explicit-any,@typescript-eslint/no-unsafe-assignment */

import type { Result } from '../result';

/**
 * Creates a {@link Failure} result from a given error.
 *
 * Passing a `Promise` is allowed, but it is recommended to `await` it before passing to `fail`.
 *
 * @typeParam E - The type of the error to wrap.
 * @returns A {@link Result} containing the given error.
 *
 * @example Synchronous Usage
 * ```ts
 * import { Result } from '@praha/byethrow';
 *
 * const result = Result.fail('Something went wrong');
 * // Result.Result<never, string>
 * ```
 *
 * @example With No Value
 * ```ts
 * import { Result } from '@praha/byethrow';
 *
 * const result = Result.fail();
 * // Result.Result<never, void>
 * ```
 *
 * @see {@link collect} - For collect multiple Results into a single Result.
 * @see {@link sequence} - For sequence multiple Results into a single Result.
 *
 * @category Creators
 */
export function fail(): Result<never, void>;
export function fail<const E>(error: E): Result<never, E>;
export function fail(...args: any[]): any {
  if (args.length <= 0) {
    return { type: 'Failure', error: undefined };
  }

  const error = args[0];
  return { type: 'Failure', error };
}
