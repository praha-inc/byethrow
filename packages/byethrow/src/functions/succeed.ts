/* oxlint-disable @typescript-eslint/no-explicit-any,@typescript-eslint/no-unsafe-return,@typescript-eslint/no-unsafe-assignment */

import type { Result } from '../result';

/**
 * Creates a {@link Success} result from a given value.
 *
 * Passing a `Promise` is a type error — `await` it before passing to `succeed`.
 *
 * @function
 * @typeParam T - The type of the value to wrap.
 * @returns A {@link Result} containing the given value.
 *
 * @example Synchronous Usage
 * ```ts
 * import { Result } from '@praha/byethrow';
 *
 * const result = Result.succeed(42);
 * // Result.Result<42, never>
 * ```
 *
 * @example Asynchronous Usage
 * ```ts
 * import { Result } from '@praha/byethrow';
 *
 * const value = await Promise.resolve(42);
 * const result = Result.succeed(value);
 * // Result.Result<number, never>
 * ```
 *
 * @example With No Value
 * ```ts
 * import { Result } from '@praha/byethrow';
 *
 * const result = Result.succeed();
 * // Result.Result<void, never>
 * ```
 *
 * @see {@link collect} - For collect multiple Results into a single Result.
 *
 * @category Creators
 */
export const succeed: {
  (): Result<void, never>;
  <const T>(value: T): [T] extends [Promise<any>] ? never : Result<T, never>;
} = ((...args: any[]) => {
  if (args.length <= 0) {
    return { type: 'Success', value: undefined };
  }

  return { type: 'Success', value: args[0] };
}) as any;
