/* oxlint-disable @typescript-eslint/no-explicit-any,@typescript-eslint/no-unsafe-return,@typescript-eslint/no-unsafe-assignment */

import type { Result } from '../result';

/**
 * Creates a {@link Failure} result from a given error.
 *
 * Passing a `Promise` is a type error — `await` it before passing to `fail`.
 *
 * @function
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
 * @example Asynchronous Usage
 * ```ts
 * import { Result } from '@praha/byethrow';
 *
 * const error = await Promise.resolve('Async error');
 * const result = Result.fail(error);
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
 *
 * @category Creators
 */
export const fail: {
  (): Result<never, void>;
  <const E>(error: E): [E] extends [Promise<any>] ? never : Result<never, E>;
} = ((...args: any[]) => {
  if (args.length <= 0) {
    return { type: 'Failure', error: undefined };
  }

  return { type: 'Failure', error: args[0] };
}) as any;
