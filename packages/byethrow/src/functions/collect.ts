/* eslint-disable @typescript-eslint/no-explicit-any */

import { fail } from './fail';
import { isFailure } from './is-failure';
import { succeed } from './succeed';
import { isPromise } from '../internals/helpers/is-promise';

import type {
  InferFailure,
  InferSuccess,
  Result,
  ResultAsync,
  ResultFor,
  ResultMaybeAsync,
} from '../result';

/**
 * Collects multiple {@link Result} or {@link ResultAsync} values into a single result.
 * If all results are {@link Success}, returns a {@link Success} containing all values.
 * If any result is a {@link Failure}, returns a {@link Failure} containing an array of all errors.
 *
 * @function
 * @typeParam X - The input type (object or array of Results).
 *
 * @example Object of Results (all succeed)
 * ```ts
 * import { Result } from '@praha/byethrow';
 *
 * const result = Result.collect({
 *   name: Result.succeed('Alice'),
 *   age: Result.succeed(20),
 * });
 * // { type: 'Success', value: { name: 'Alice', age: 20 } }
 * ```
 *
 * @example Object of Results (some fail)
 * ```ts
 * import { Result } from '@praha/byethrow';
 *
 * const result = Result.collect({
 *   name: Result.succeed('Alice'),
 *   age: Result.fail('Invalid age'),
 * });
 * // { type: 'Failure', error: ['Invalid age'] }
 * ```
 *
 * @example Array of Results (all succeed)
 * ```ts
 * import { Result } from '@praha/byethrow';
 *
 * const result = Result.collect([
 *   Result.succeed(1),
 *   Result.succeed(2),
 *   Result.succeed(3),
 * ]);
 * // { type: 'Success', value: [1, 2, 3] }
 * ```
 *
 * @example Array of Results (some fail)
 * ```ts
 * import { Result } from '@praha/byethrow';
 *
 * const result = Result.collect([
 *   Result.succeed(1),
 *   Result.fail('error1'),
 *   Result.fail('error2'),
 * ]);
 * // { type: 'Failure', error: ['error1', 'error2'] }
 * ```
 *
 * @category Utilities
 */
export const collect: {
  <X extends Record<string, ResultMaybeAsync<any, any>>>(x: X): ResultFor<X[keyof X], { [K in keyof X ]: InferSuccess<X[K]> }, InferFailure<X[keyof X]>[]>;
  <const X extends Array<ResultMaybeAsync<any, any>>>(x: X): ResultFor<X[number], { [K in keyof X ]: InferSuccess<X[K]> }, InferFailure<X[number]>[]>;
} = (value: unknown): any => {
  if (Array.isArray(value)) {
    const group = (results: Result<unknown, unknown>[]) => {
      const errors: unknown[] = [];
      const successes: unknown[] = [];

      for (const result of results) {
        if (isFailure(result)) {
          errors.push(result.error);
        } else {
          successes.push(result.value);
        }
      }

      return { errors, successes };
    };

    if (value.some(isPromise)) {
      const results = value as Array<ResultAsync<unknown, unknown>>;
      return Promise.all(results).then((results: Array<Result<unknown, unknown>>) => {
        const { successes, errors } = group(results);
        return errors.length > 0 ? fail(errors) : succeed(successes);
      });
    }

    const results = value as Array<Result<unknown, unknown>>;
    const { successes, errors } = group(results);
    return errors.length > 0 ? fail(errors) : succeed(successes);
  } else {
    const group = (entries: Array<Readonly<[string, Result<unknown, unknown>]>>) => {
      const errors: unknown[] = [];
      const successes: Record<string, unknown> = {};

      for (const [key, result] of entries) {
        if (isFailure(result)) {
          errors.push(result.error);
        } else {
          successes[key] = result.value;
        }
      }

      return { errors, successes };
    };

    const entries = Object.entries(value as Record<string, any>);
    if (entries.some(([, result]) => isPromise(result))) {
      const results = entries as Array<[string, ResultAsync<any, any>]>;
      const promises = results.map(async ([key, result]) => [key, await result] as const);
      return Promise.all(promises).then((entries) => {
        const { successes, errors } = group(entries);
        return errors.length > 0 ? fail(errors) : succeed(successes);
      });
    }

    const { successes, errors } = group(entries);
    return errors.length > 0 ? fail(errors) : succeed(successes);
  }
};
