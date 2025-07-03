/* eslint-disable @typescript-eslint/no-explicit-any,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access */

import { fail } from './fail';
import { succeed } from './succeed';
import { isPromise } from '../internals/helpers/is-promise';

import type { Result, ResultAsync } from '../result';

/**
 * Wraps a function execution (sync or async) or a Promise in a {@link Result} or {@link ResultAsync} type,
 * capturing errors and returning them in a structured way.
 *
 * You can use either a custom `catch` handler or rely on the `safe: true` option
 * to assume the function cannot throw.
 *
 * @function
 * @typeParam T - The function type to execute (sync or async) or a Promise type.
 * @typeParam E - The error type to return if `catch` is used.
 *
 * @example Promise Try-Catch
 * ```ts
 * import { Result } from '@praha/byethrow';
 *
 * const result = Result.try({
 *   try: fetch('/api/data'),
 *   catch: (error) => new Error('Fetch failed', { cause: error }),
 * });
 *
 * // result is ResultAsync<Response, Error>
 * ```
 *
 * @example Promise Safe
 * ```ts
 * import { Result } from '@praha/byethrow';
 *
 * const result = Result.try({
 *   safe: true,
 *   try: Promise.resolve('ok'),
 * });
 *
 * // result is ResultAsync<string, never>
 * ```
 *
 * @example Sync Try-Catch
 * ```ts
 * import { Result } from '@praha/byethrow';
 *
 * const fn = Result.try({
 *   try: (x: number) => {
 *     if (x < 0) throw new Error('Negative!');
 *     return x * 2;
 *   },
 *   catch: (error) => new Error('Oops!', { cause: error }),
 * });
 *
 * const result = fn(5); // Result.Result<number, Error>
 * ```
 *
 * @example Sync Safe
 * ```ts
 * import { Result } from '@praha/byethrow';
 *
 * const fn = Result.try({
 *   safe: true,
 *   try: (x: number) => x + 1,
 * });
 *
 * const result = fn(1); // Result.Result<number, never>
 * ```
 *
 * @example Async Function Try-Catch
 * ```ts
 * import { Result } from '@praha/byethrow';
 *
 * const fn = Result.try({
 *   try: async (id: string) => await fetch(`/api/data/${id}`),
 *   catch: (error) => new Error('Oops!', { cause: error }),
 * });
 *
 * const result = await fn('abc'); // Result.ResultAsync<Response, Error>
 * ```
 *
 * @example Async Function Safe
 * ```ts
 * import { Result } from '@praha/byethrow';
 *
 * const fn = Result.try({
 *   safe: true,
 *   try: async () => await Promise.resolve('ok'),
 * });
 *
 * const result = await fn(); // Result.ResultAsync<string, never>
 * ```
 *
 * @category Creators
 */
const try_: {
  <T extends Promise<any>, E>(
    options: { try: T; catch: (error: unknown) => E }
  ): ResultAsync<Awaited<T>, E>;
  <T extends Promise<any>>(
    options: { try: T; safe: true }
  ): ResultAsync<Awaited<T>, never>;
  <T extends (...args: readonly any[]) => Promise<any>, E>(
    options: { try: T; catch: (error: unknown) => E }
  ): (...args: Parameters<T>) => ResultAsync<Awaited<ReturnType<T>>, E>;
  <T extends (...args: readonly any[]) => Promise<any>>(
    options: { try: T; safe: true }
  ): (...args: Parameters<T>) => ResultAsync<Awaited<ReturnType<T>>, never>;
  <T extends (...args: readonly any[]) => any, E>(
    options: { try: T; catch: (error: unknown) => E }
  ): (...args: Parameters<T>) => Result<ReturnType<T>, E>;
  <T extends (...args: readonly any[]) => any>(
    options: { try: T; safe: true }
  ): (...args: Parameters<T>) => Result<ReturnType<T>, never>;
} = (options: any) => {
  if (isPromise(options.try)) {
    if ('safe' in options && options.safe) {
      return succeed(options.try);
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return options.try.then(
      (value: any) => succeed(value),
      (error: unknown) => fail(options.catch(error)),
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return ((...args: any[]) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const output = options.try(...args);
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
  }) as any;
};

export { try_ as try };
