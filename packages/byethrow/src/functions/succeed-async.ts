/* oxlint-disable @typescript-eslint/no-explicit-any,@typescript-eslint/no-unsafe-return */

import type { ResultAsync } from '../result';

/**
 * Creates a {@link Success} result from a Promise.
 * The Promise is awaited and the resolved value is wrapped in a {@link Success}.
 * The return type is always a {@link ResultAsync}.
 *
 * This is the async counterpart of {@link succeedSync}, providing an explicit way to create
 * async results without relying on runtime Promise detection.
 *
 * @function
 * @typeParam T - The type of the resolved Promise value.
 * @returns A {@link ResultAsync} containing the resolved value.
 *
 * @example Basic Usage
 * ```ts
 * import { Result } from '@praha/byethrow';
 *
 * const result = Result.succeedAsync(Promise.resolve(42));
 * // Result.ResultAsync<number, never>
 * ```
 *
 * @see {@link succeedSync} - For synchronous result creation.
 * @see {@link succeed} - For automatic Promise detection (not suitable for generic contexts).
 *
 * @category Creators
 */
export const succeedAsync = <T>(value: Promise<T>): ResultAsync<T, never> => {
  return value.then((resolved) => ({ type: 'Success', value: resolved })) as any;
};
