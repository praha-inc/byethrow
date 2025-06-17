/* eslint-disable @typescript-eslint/no-explicit-any */

import { isFailure } from './is-failure';
import { isPromise } from '../internals/helpers/is-promise';

import type { InferFailure, InferSuccess, Result, ResultFor, ResultMaybeAsync } from '../result';

/**
 * Runs an additional computation using the success value of a {@link Result} or {@link ResultAsync},
 * but **returns the original result** if the additional computation is successful.
 *
 * If either the original result or the side effect result is a {@link Failure}, that failure is returned.
 * Useful for running validations or side effects without altering the main result on success.
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
 *   Result.andThrough((x) => {
 *     return x > 0 ? Result.succeed(null) : Result.fail('Must be > 0');
 *   }),
 * );
 * // { type: 'Success', value: 5 }
 * ```
 *
 * @example Failure Case (input is a Failure)
 * ```ts
 * import { Result } from '@praha/byethrow';
 *
 * const result = Result.pipe(
 *   Result.fail('error),
 *   Result.andThrough((x) => {
 *     return x > 0 ? Result.succeed(null) : Result.fail('Must be > 0');
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
 *   Result.succeed(-10),
 *   Result.andThrough((x) => {
 *     return x > 0 ? Result.succeed(null) : Result.fail('Must be > 0');
 *   }),
 * );
 * // { type: 'Failure', error: 'Must be > 0' }
 * ```
 *
 * @category Combinators
 */
export const andThrough: {
  <R1 extends ResultMaybeAsync<any, any>, R2 extends ResultMaybeAsync<any, any>>(fn: (a: InferSuccess<R1>) => R2): (result: R1) => ResultFor<R1 | R2, InferSuccess<R1>, InferFailure<R1> | InferFailure<R2>>;
  <F extends (a: any) => ResultMaybeAsync<any, any>>(fn: F): <R1 extends ResultMaybeAsync<Parameters<F>[0], any>>(result: R1) => ResultFor<R1 | ReturnType<F>, InferSuccess<R1>, InferFailure<R1> | InferFailure<F>>;
} = <R1 extends ResultMaybeAsync<any, any>, R2 extends ResultMaybeAsync<any, any>>(fn: (a: InferSuccess<R1>) => R2) => {
  return (result: R1) => {
    const apply = (r: Result<InferSuccess<R1>, InferFailure<R1>>) => {
      if (isFailure(r)) return r;
      const next = fn(r.value);
      if (next instanceof Promise) {
        return next.then((n) => {
          if (isFailure(n)) return n;
          return r;
        });
      }

      if (isFailure(next)) return next;
      return r;
    };

    return isPromise(result) ? result.then(apply) : apply(result);
  };
};
