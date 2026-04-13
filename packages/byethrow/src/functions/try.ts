/* oxlint-disable @typescript-eslint/no-explicit-any,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access */

import { fail } from './fail';
import { succeed } from './succeed';
import { isPromise } from '../internals/helpers/is-promise';

import type { Result, ResultAsync } from '../result';

/**
 * Executes a function that may throw and wraps the result in a {@link Result} or {@link ResultAsync}.
 *
 * You can use either a custom `catch` handler or rely on the `safe: true` option
 * to assume the function cannot throw.
 *
 * @function
 * @typeParam T - The function type to execute (sync or async) or a Promise type.
 * @typeParam E - The error type to return if `catch` is used.
 * @returns A {@link Result} or {@link ResultAsync} wrapping the function's return value or the caught error.
 *
 * @example Sync try-catch
 * ```ts
 * import { Result } from '@praha/byethrow';
 *
 * const result = Result.try({
 *   try: () => {
 *     const x = Math.random() * 10 - 5;
 *     if (x < 0) throw new Error('Negative!');
 *     return x * 2;
 *   },
 *   catch: (error) => new Error('Oops!', { cause: error }),
 * });
 *
 * // result is Result<number, Error>
 * ```
 *
 * @example Sync safe
 * ```ts
 * import { Result } from '@praha/byethrow';
 *
 * const result = Result.try({
 *   safe: true,
 *   try: () => Math.random() + 1,
 * });
 *
 * // result is Result<number, never>
 * ```
 *
 * @example Async try-catch
 * ```ts
 * import { Result } from '@praha/byethrow';
 *
 * const result = Result.try({
 *   try: () => fetch('/api/data'),
 *   catch: (error) => new Error('Fetch failed', { cause: error }),
 * });
 *
 * // result is ResultAsync<Response, Error>
 * ```
 *
 * @example Async safe
 * ```ts
 * import { Result } from '@praha/byethrow';
 *
 * const result = Result.try({
 *   safe: true,
 *   try: () => Promise.resolve('ok'),
 * });
 *
 * // result is ResultAsync<string, never>
 * ```
 *
 * @category Creators
 */
const try_: {
  <T extends () => Promise<any>, E>(
    options: { try: T; catch: (error: unknown) => E }
  ): ResultAsync<Awaited<ReturnType<T>>, E>;
  <T extends () => Promise<any>>(
    options: { safe: true; try: T }
  ): ResultAsync<Awaited<ReturnType<T>>, never>;
  <T extends () => any, E>(
    options: { try: T; catch: (error: unknown) => E }
  ): Result<ReturnType<T>, E>;
  <T extends () => any>(
    options: { safe: true; try: T }
  ): Result<ReturnType<T>, never>;
} = (options: any) => {
  const fn = (): any => {
    try {
      // oxlint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const output = options.try();
      if (isPromise(output)) {
        const promise = succeed(output);
        if ('safe' in options && options.safe) return promise;
        return promise.catch((error) => fail(options.catch(error)));
      }

      return succeed(output);
    } catch (error) {
      if ('safe' in options && options.safe) {
        throw error;
      }

      return fail(options.catch(error));
    }
  };

  // oxlint-disable-next-line @typescript-eslint/no-unsafe-return
  return fn();
};

export { try_ as try };
