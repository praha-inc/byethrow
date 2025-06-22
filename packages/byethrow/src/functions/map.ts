/* eslint-disable @typescript-eslint/no-explicit-any */

import { isFailure } from './is-failure';
import { succeed } from './succeed';
import { isPromise } from '../internals/helpers/is-promise';

import type { InferFailure, InferSuccess, Result, ResultFor, ResultMaybeAsync } from '../result';

/**
 * Applies a transformation function to the success value of a {@link Result} or {@link ResultAsync}.
 * If the input is a {@link Failure}, it will be returned unchanged.
 *
 * @function
 * @typeParam R1 - The input {@link Result} or {@link ResultAsync}.
 * @typeParam T2 - The transformed success value type.
 *
 * @example Success Case
 * ```ts
 * import { Result } from '@praha/byethrow';
 *
 * const result = Result.pipe(
 *   Result.succeed(2),
 *   Result.map((x) => x * 10),
 * );
 * // { type: 'Success', value: 20 }
 * ```
 *
 * @example Failure Case (unchanged)
 * ```ts
 * import { Result } from '@praha/byethrow';
 *
 * const result = Result.pipe(
 *   Result.fail('error'),
 *   Result.map((x) => x * 10),
 * );
 * // { type: 'Failure', error: 'error' }
 * ```
 *
 * @see {@link pipe} - It is recommended to use this function with the {@link pipe} function for better readability and composability.
 *
 * @category Combinators
 */
export const map: {
  <R1 extends ResultMaybeAsync<any, any>, T2>(fn: (a: InferSuccess<R1>) => T2): (result: R1) => ResultFor<R1, T2, InferFailure<R1>>;
  <T1, T2>(fn: (a: T1) => T2): <R1 extends ResultMaybeAsync<T1, any>>(result: R1) => ResultFor<R1, T2, InferFailure<R1>>;
} = <T1, T2>(fn: (a: T1) => T2) => {
  return <R1 extends ResultMaybeAsync<T1, any>>(result: R1): ResultFor<R1, T2, InferFailure<R1>> => {
    const apply = (r: Result<T1, InferFailure<R1>>) => {
      if (isFailure(r)) return r;
      return succeed<T2>(fn(r.value));
    };

    if (isPromise(result)) {
      return result.then<unknown>(apply) as ResultFor<R1, T2, InferFailure<R1>>;
    }

    return apply(result) as ResultFor<R1, T2, InferFailure<R1>>;
  };
};
