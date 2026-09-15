/* oxlint-disable @typescript-eslint/no-explicit-any */

import { isFailure } from "./is-failure";
import { succeed } from "./succeed";
import { isPromise } from "../internals/helpers/is-promise";

import type {
  InferFailure,
  InferSuccess,
  Result,
  ResultFor,
  ResultMaybeAsync,
} from "../result";

/**
 * Represents split outputs from {@link partition}.
 *
 * @typeParam T - The successful value type.
 * @typeParam E - The failure value type.
 */
export type Partition<T, E> = {
  succeeded: T[];
  failed: E[];
};

/**
 * Splits a list of {@link Result} or {@link ResultAsync} values into successful values and failed errors.
 *
 * This helper always returns a {@link Success}.
 *
 * @function
 * @typeParam X - The input array of results.
 *
 * @example
 * ```ts
 * import { Result } from '@praha/byethrow';
 *
 * const result = Result.partition([
 *   Result.succeed(1),
 *   Result.fail('error'),
 *   Result.succeed(2),
 * ]);
 * // { type: 'Success', value: { succeeded: [1, 2], failed: ['error'] } }
 * ```
 *
 * @category Utilities
 */
export const partition: {
  <const X extends Array<ResultMaybeAsync<any, any>>>(
    results: X,
  ): ResultFor<
    X[number],
    Partition<InferSuccess<X[number]>, InferFailure<X[number]>>,
    never
  >;
  <const X extends ReadonlyArray<ResultMaybeAsync<any, any>>>(
    results: X,
  ): ResultFor<
    X[number],
    Partition<InferSuccess<X[number]>, InferFailure<X[number]>>,
    never
  >;
} = (results: ReadonlyArray<ResultMaybeAsync<any, any>>): any => {
  const succeeded: unknown[] = [];
  const failed: unknown[] = [];

  const separate = (result: Result<unknown, unknown>) => {
    if (isFailure(result)) {
      failed.push(result.error);
    } else {
      succeeded.push(result.value);
    }
  };

  for (const [index, result] of results.entries()) {
    if (isPromise(result)) {
      return Promise.all(results.slice(index)).then((resolvedResults) => {
        for (const result of resolvedResults) {
          separate(result);
        }

        return succeed({ succeeded, failed });
      });
    }

    separate(result);
  }

  return succeed({ succeeded, failed });
};
