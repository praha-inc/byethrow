/* eslint-disable @typescript-eslint/no-explicit-any */

import { isSuccess } from './is-success';
import { isPromise } from '../internals/helpers/is-promise';

import type { InferFailure, InferSuccess, Result, ResultFor, ResultMaybeAsync } from '../result';

/**
 * Chains the next computation using the error value of a {@link Result} or {@link ResultAsync}.
 * If the original result is a {@link Success}, it is returned unchanged.
 * Otherwise, the provided function is called, and its result is returned as-is.
 *
 * @function
 * @typeParam R1 - The input {@link Result} or {@link ResultAsync}.
 * @typeParam R2 - The result type returned by `fn`.
 *
 * @example Success Case
 * ```ts
 * import { Result } from '@praha/byethrow';
 *
 * const result = Result.pipe(
 *   Result.succeed(42),
 *   Result.orElse((error) => Result.succeed(0)),
 * );
 * // { type: 'Success', value: 42 }
 * ```
 *
 * @example Failure Case (function returns a Success)
 * ```ts
 * const result = Result.pipe(
 *   Result.fail('original error'),
 *   Result.orElse((error) => Result.succeed('default value')),
 * );
 * // result: { type: 'Success', value: 'default value' }
 * ```
 *
 * @example Failure Case (function returns a Failure)
 * ```ts
 * const result = Result.pipe(
 *   Result.fail('original error'),
 *   Result.orElse((error) => Result.fail('new error: ' + error)),
 * );
 * // result: { type: 'Failure', error: 'new error: original error' }
 * ```
 *
 * @see {@link pipe} - It is recommended to use this function with the {@link pipe} function for better readability and composability.
 *
 * @category Combinators
 */
export const orElse: {
  <R1 extends ResultMaybeAsync<any, any>, R2 extends ResultMaybeAsync<any, any>>(fn: (a: InferFailure<R1>) => R2): (result: R1) => ResultFor<R1 | R2, InferSuccess<R1> | InferSuccess<R2>, InferFailure<R2>>;
  <F extends (a: any) => ResultMaybeAsync<any, any>>(fn: F): <R1 extends ResultMaybeAsync<any, Parameters<F>[0]>>(result: R1) => ResultFor<R1 | ReturnType<F>, InferSuccess<R1> | InferSuccess<F>, InferFailure<F>>;
} = <R1 extends ResultMaybeAsync<any, any>, R2 extends ResultMaybeAsync<any, any>>(fn: (a: InferFailure<R1>) => R2) => {
  return (result: R1) => {
    const apply = (r: Result<InferSuccess<R1>, InferFailure<R1>>) => {
      if (isSuccess(r)) return r;
      return fn(r.error);
    };

    return isPromise(result) ? result.then(apply) : apply(result);
  };
};
