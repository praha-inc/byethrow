/* oxlint-disable @typescript-eslint/no-explicit-any,@typescript-eslint/no-unsafe-return,@typescript-eslint/no-unsafe-assignment */

import type { Result } from '../result';

/**
 * Creates a {@link Success} result from a given value.
 * Unlike {@link succeed}, this function does NOT unwrap Promises.
 * The value is always wrapped as-is, and the return type is always a synchronous {@link Result}.
 *
 * This makes `succeedSync` safe to use inside generic functions where the type parameter `T`
 * is unresolved, avoiding the deferred conditional type issue with {@link succeed}.
 *
 * @function
 * @typeParam T - The type of the value to wrap.
 * @returns A synchronous {@link Result} containing the value.
 *
 * @example Basic Usage
 * ```ts
 * import { Result } from '@praha/byethrow';
 *
 * const result = Result.succeedSync(42);
 * // Result.Result<42, never>
 * ```
 *
 * @example Inside a Generic Function
 * ```ts
 * import { Result } from '@praha/byethrow';
 *
 * function wrap<T>(value: T): Result.Result<T, never> {
 *   return Result.succeedSync(value);
 * }
 * ```
 *
 * @example With No Value
 * ```ts
 * import { Result } from '@praha/byethrow';
 *
 * const result = Result.succeedSync();
 * // Result.Result<void, never>
 * ```
 *
 * @see {@link succeed} - For automatic Promise detection (not suitable for generic contexts).
 *
 * @category Creators
 */
export const succeedSync: {
  (): Result<void, never>;
  <const T>(value: T): Result<T, never>;
} = (...args: any[]) => {
  if (args.length <= 0) {
    return { type: 'Success', value: undefined } as any;
  }
  return { type: 'Success', value: args[0] } as any;
};
