/* eslint-disable @typescript-eslint/no-explicit-any */

import { isSuccess } from './is-success';
import { isPromise } from '../internals/helpers/is-promise';

import type { InferFailure, InferSuccess, Result, ResultFor, ResultMaybeAsync } from '../result';

/**
 * Runs an additional computation using the error value of a {@link Result} or {@link ResultAsync},
 * but **returns the original failure** if the additional computation is successful.
 *
 * If the original result is a {@link Success}, it is returned immediately without running the function.
 * If the original result is a {@link Failure}, the function is executed with the error value.
 * If the function returns a {@link Success}, the original failure is returned.
 * If the function returns a {@link Failure}, that new failure is returned.
 *
 * Useful for running error recovery or fallback logic while preserving the original error on success.
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
 *   Result.succeed(5),
 *   Result.orThrough((error) => {
 *     return Result.succeed(null);
 *   }),
 * );
 * // { type: 'Success', value: 5 }
 * ```
 *
 * @example Failure Case (function returns a Success)
 * ```ts
 * import { Result } from '@praha/byethrow';
 *
 * const result = Result.pipe(
 *   Result.fail('error'),
 *   Result.orThrough((error) => {
 *     console.log('Logging error:', error);
 *     return Result.succeed(null);
 *   }),
 * );
 * // { type: 'Failure', error: 'error' }
 * ```
 *
 * @example Failure Case (function returns a Failure)
 * ```ts
 * import { Result } from '@praha/byethrow';
 *
 * const result = Result.pipe(
 *   Result.fail('original error'),
 *   Result.orThrough((error) => {
 *     return Result.fail('new error');
 *   }),
 * );
 * // { type: 'Failure', error: 'new error' }
 * ```
 *
 * @see {@link pipe} - It is recommended to use this function with the {@link pipe} function for better readability and composability.
 *
 * @category Combinators
 */
export const orThrough: {
  <R1 extends ResultMaybeAsync<any, any>, R2 extends ResultMaybeAsync<any, any>>(fn: (a: InferFailure<R1>) => R2): (result: R1) => ResultFor<R1 | R2, InferSuccess<R1>, InferFailure<R1> | InferFailure<R2>>;
  <F extends (a: any) => ResultMaybeAsync<any, any>>(fn: F): <R1 extends ResultMaybeAsync<any, Parameters<F>[0]>>(result: R1) => ResultFor<R1 | ReturnType<F>, InferSuccess<R1>, InferFailure<R1> | InferFailure<F>>;
} = <R1 extends ResultMaybeAsync<any, any>, R2 extends ResultMaybeAsync<any, any>>(fn: (error: InferFailure<R1>) => R2) => {
  return (result: R1) => {
    const apply = (r: Result<InferSuccess<R1>, InferFailure<R1>>) => {
      if (isSuccess(r)) return r;
      const next = fn(r.error);
      if (isPromise(next)) {
        return next.then((n) => {
          if (isSuccess(n)) return r;
          return n;
        });
      }

      if (isSuccess(next)) return r;
      return next;
    };

    return isPromise(result) ? result.then(apply) : apply(result);
  };
};
