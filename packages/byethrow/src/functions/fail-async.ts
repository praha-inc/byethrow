/* oxlint-disable @typescript-eslint/no-explicit-any,@typescript-eslint/no-unsafe-return */

import type { ResultAsync } from '../result';

/**
 * Creates a {@link Failure} result from a Promise.
 * The Promise is awaited and the resolved value is wrapped in a {@link Failure}.
 * The return type is always a {@link ResultAsync}.
 *
 * This is the async counterpart of {@link failSync}, providing an explicit way to create
 * async failure results without relying on runtime Promise detection.
 *
 * @function
 * @typeParam E - The type of the resolved Promise value.
 * @returns A {@link ResultAsync} containing the resolved error.
 *
 * @example Basic Usage
 * ```ts
 * import { Result } from '@praha/byethrow';
 *
 * const result = Result.failAsync(Promise.resolve('Async error'));
 * // Result.ResultAsync<never, string>
 * ```
 *
 * @see {@link failSync} - For synchronous failure creation.
 * @see {@link fail} - For automatic Promise detection (not suitable for generic contexts).
 *
 * @category Creators
 */
export const failAsync = <E>(error: Promise<E>): ResultAsync<never, E> => {
  return error.then((resolved) => ({ type: 'Failure', error: resolved })) as any;
};
