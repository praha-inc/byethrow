/* eslint-disable @typescript-eslint/no-explicit-any */

import { fail } from './fail';
import { isFailure } from './is-failure';
import { succeed } from './succeed';
import { isPromise } from '../internals/helpers/is-promise';

import type {
  InferFailure,
  InferSuccess,
  Result,
  ResultFor,
  ResultMaybeAsync,
} from '../result';

/**
 * Processes multiple {@link Result} or {@link ResultAsync} values into a single result.
 * If all results are {@link Success}, returns a {@link Success} containing all values.
 * If any result is a {@link Failure}, immediately stops processing and returns a {@link Failure} with that single error.
 *
 * Unlike {@link collect}, which processes all results and collects all errors,
 * `sequence` stops at the first error and returns only that error.
 *
 * @function
 * @typeParam X - The input type (object or array of Results).
 *
 * @example Object of Results (all succeed)
 * ```ts
 * import { Result } from '@praha/byethrow';
 *
 * const result = Result.sequence({
 *   name: Result.succeed('Alice'),
 *   age: Result.succeed(20),
 * });
 * // { type: 'Success', value: { name: 'Alice', age: 20 } }
 * ```
 *
 * @example Object of Results (stops at first failure)
 * ```ts
 * import { Result } from '@praha/byethrow';
 *
 * const result = Result.sequence({
 *   name: Result.succeed('Alice'),
 *   age: Result.fail('Invalid age'),
 * });
 * // { type: 'Failure', error: 'Invalid age' }
 * ```
 *
 * @example Array of Results (all succeed)
 * ```ts
 * import { Result } from '@praha/byethrow';
 *
 * const result = Result.sequence([
 *   Result.succeed(1),
 *   Result.succeed(2),
 * ]);
 * // { type: 'Success', value: [1, 2, 3] }
 * ```
 *
 * @example Array of Results (stops at first failure)
 * ```ts
 * import { Result } from '@praha/byethrow';
 *
 * const result = Result.sequence([
 *   Result.succeed(1),
 *   Result.fail('error1'),
 * ]);
 * // { type: 'Failure', error: 'error1' }
 * ```
 *
 * @example Using a mapper function (all succeed)
 * ```ts
 * import { Result } from '@praha/byethrow';
 *
 * const result = Result.sequence(['1', '2', '3'], (value) => {
 *   const number = Number(value);
 *   return Number.isNaN(number)
 *     ? Result.fail(`Invalid number: ${value}`)
 *     : Result.succeed(number);
 * });
 * // { type: 'Success', value: [1, 2, 3] }
 * ```
 *
 * @example Using a mapper function (stops at first failure)
 * ```ts
 * import { Result } from '@praha/byethrow';
 *
 * const result = Result.sequence(['1', 'invalid', '3'], (value) => {
 *   const number = Number(value);
 *   return Number.isNaN(number)
 *     ? Result.fail(`Invalid number: ${value}`)
 *     : Result.succeed(number);
 * });
 * // { type: 'Failure', error: 'Invalid number: invalid' }
 * ```
 *
 * @category Utilities
 */
export const sequence: {
  <X extends Record<string, ResultMaybeAsync<any, any>>>(x: X): ResultFor<X[keyof X], { [K in keyof X]: InferSuccess<X[K]> }, InferFailure<X[keyof X]>>;
  <const X extends Array<ResultMaybeAsync<any, any>>>(x: X): ResultFor<X[number], { [K in keyof X]: InferSuccess<X[K]> }, InferFailure<X[number]>>;
  <const X extends ReadonlyArray<ResultMaybeAsync<any, any>>>(x: X): ResultFor<X[number], { [K in keyof X]: InferSuccess<X[K]> }, InferFailure<X[number]>>;
  <const X extends Array<unknown>, Fn extends (value: X[number]) => ResultMaybeAsync<any, any>>(x: X, fn: Fn): ResultFor<ReturnType<Fn>, { [K in keyof X]: InferSuccess<Fn> }, InferFailure<Fn>>;
  <const X extends ReadonlyArray<unknown>, Fn extends (value: X[number]) => ResultMaybeAsync<any, any>>(x: X, fn: Fn): ResultFor<ReturnType<Fn>, { [K in keyof X]: InferSuccess<Fn> }, InferFailure<Fn>>;
} = (value: unknown, fn?: (value: unknown) => ResultMaybeAsync<any, any>): any => {
  const reduce = <T>(
    entries: Array<readonly [any, any]>,
    callback: (accumulator: T, value: unknown, entry: readonly [any, any]) => void,
    initialValue: T,
  ): ResultMaybeAsync<T, unknown> => {
    const accumulator = initialValue;

    for (const [index, entry] of entries.entries()) {
      const result = (fn ? fn(entry[1]) : entry[1]) as ResultMaybeAsync<T, unknown>;
      if (isPromise(result)) {
        return result.then(async (result) => {
          if (isFailure(result)) {
            return fail(result.error);
          }
          callback(accumulator, result.value, entry);

          for (const entry of entries.slice(index + 1)) {
            const result = await (fn ? fn(entry[1]) : entry[1]) as Result<T, unknown>;
            if (isFailure(result)) {
              return fail(result.error);
            }
            callback(accumulator, result.value, entry);
          }
          return succeed(accumulator) as Result<T, unknown>;
        });
      }

      if (isFailure(result)) {
        return fail(result.error);
      }
      callback(accumulator, result.value, entry);
    }
    return succeed(accumulator);
  };

  if (Array.isArray(value)) {
    if (fn) {
      return reduce(
        [...value.entries()],
        (accumulator, value) => accumulator.push(value),
        [] as unknown[],
      );
    }

    return reduce(
      [...(value as Array<ResultMaybeAsync<unknown, unknown>>).entries()],
      (accumulator, value) => accumulator.push(value),
      [] as unknown[],
    );
  } else {
    return reduce(
      Object.entries(value as Record<string, any>),
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      (accumulator, value, [key]) => { accumulator[key] = value; },
      {} as Record<string, unknown>,
    );
  }
};
