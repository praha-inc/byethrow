/* eslint-disable @typescript-eslint/no-explicit-any */

import { isFailure } from './is-failure';
import { isPromise } from '../internals/helpers/is-promise';

import type { InferFailure, InferSuccess, Result, ResultFor, ResultMaybeAsync } from '../result';

/**
 * Chains the next computation using the success value of a {@link Result} or {@link ResultAsync}.
 * If the original result is a {@link Failure}, it is returned unchanged.
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
 *   Result.succeed(3),
 *   Result.andThen((x) => Result.succeed(x * 2)),
 * );
 * // { type: 'Success', value: 6 }
 * ```
 *
 * @example Failure Case (input is a Failure)
 * ```ts
 * const result = Result.pipe(
 *   Result.fail('error'),
 *   Result.andThen((x) => Result.succeed(x * 2)),
 * );
 * // result: { type: 'Failure', error: 'error' }
 * ```
 *
 * @example Failure Case (function returns a Failure)
 * ```ts
 * const result = Result.pipe(
 *   Result.succeed(3),
 *   Result.andThen((x) => Result.fail('error: ' + x)),
 * );
 * // result: { type: 'Failure', error: 'error: 3' }
 * ```
 *
 * @see {@link pipe} - It is recommended to use this function with the {@link pipe} function for better readability and composability.
 *
 * @category Combinators
 */
export const andThen: {
  <R1 extends ResultMaybeAsync<any, any>, R2 extends ResultMaybeAsync<any, any>>(fn: (a: InferSuccess<R1>) => R2): (result: R1) => ResultFor<R1 | R2, InferSuccess<R2>, InferFailure<R1> | InferFailure<R2>>;
  <F extends (a: any) => ResultMaybeAsync<any, any>>(fn: F): <R1 extends ResultMaybeAsync<Parameters<F>[0], any>>(result: R1) => ResultFor<R1 | ReturnType<F>, InferSuccess<F>, InferFailure<R1> | InferFailure<F>>;
} = <R1 extends ResultMaybeAsync<any, any>, R2 extends ResultMaybeAsync<any, any>>(fn: (a: InferSuccess<R1>) => R2) => {
  return (result: R1) => {
    const apply = (r: Result<InferSuccess<R1>, InferFailure<R1>>) => {
      if (isFailure(r)) return r;
      return fn(r.value);
    };

    return isPromise(result) ? result.then(apply) : apply(result);
  };
};
