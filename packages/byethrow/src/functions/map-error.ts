/* eslint-disable @typescript-eslint/no-explicit-any */

import { fail } from './fail';
import { isSuccess } from './is-success';
import { isPromise } from '../internals/helpers/is-promise';

import type { InferFailure, InferSuccess, Result, ResultFor, ResultMaybeAsync } from '../result';

/**
 * Applies a transformation function to the error value of a {@link Result} or {@link ResultAsync}.
 * If the input is a {@link Success}, it will be returned unchanged.
 *
 * @function
 * @typeParam R1 - The input {@link Result} or {@link ResultAsync}.
 * @typeParam E2 - The transformed error value type.
 *
 * @example Failure Case (unchanged)
 * ```ts
 * import { Result } from '@praha/byethrow';
 *
 * const result = Result.pipe(
 *   Result.fail('NotFound'),
 *   Result.mapError((error) => new Error(error)),
 * );
 * // { type: 'Failure', error: Error('NotFound') }
 * ```
 *
 * @example Success Case (unchanged)
 * ```ts
 * import { Result } from '@praha/byethrow';
 *
 * const result = Result.pipe(
 *   Result.succeed(123),
 *   Result.mapError((error) => new Error(error)),
 * );
 * // { type: 'Success', value: 123 }
 * ```
 *
 * @see {@link pipe} - It is recommended to use this function with the {@link pipe} function for better readability and composability.
 *
 * @category Combinators
 */
export const mapError: {
  <R1 extends ResultMaybeAsync<any, any>, E2>(fn: (a: InferFailure<R1>) => E2): (result: R1) => ResultFor<R1, InferSuccess<R1>, E2>;
  <E1, E2>(fn: (a: E1) => E2): <R1 extends ResultMaybeAsync<any, E1>>(result: R1) => ResultFor<R1, InferSuccess<R1>, E2>;
} = <E1, E2>(fn: (a: E1) => E2) => {
  return <R1 extends ResultMaybeAsync<any, E1>>(result: R1): ResultFor<R1, InferSuccess<R1>, E2> => {
    const apply = (r: Result<InferSuccess<R1>, E1>) => {
      if (isSuccess(r)) return r;
      return fail<E2>(fn(r.error));
    };

    if (isPromise(result)) {
      return result.then<unknown>(apply) as ResultFor<R1, InferSuccess<R1>, E2>;
    }

    return apply(result) as ResultFor<R1, InferSuccess<R1>, E2>;
  };
};
