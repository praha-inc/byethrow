/* eslint-disable @typescript-eslint/no-explicit-any */

import { isFailure } from './is-failure';
import { isPromise } from '../internals/helpers/is-promise';

import type { InferFailure, InferSuccess, Result, ResultFor, ResultMaybeAsync } from '../result';

/**
 * Executes a side effect function on the error value of a {@link Result} or {@link ResultAsync},
 * without modifying the original result. This is useful for debugging, logging, or performing
 * other side effects while maintaining the original value and error state.
 *
 * @function
 * @typeParam R1 - The input {@link Result} or {@link ResultAsync}.
 * @typeParam R2 - The return type of the inspection function.
 *
 * @example Failure Case
 * ```ts
 * import { Result } from '@praha/byethrow';
 *
 * const result = Result.pipe(
 *   Result.fail('error'),
 *   Result.inspectError((error) => console.log('Debug error:', error)),
 * );
 * // Console output: "Debug error: error"
 * // Result: { type: 'Failure', error: 'error' }
 * ```
 *
 * @example Success Case
 * ```ts
 * import { Result } from '@praha/byethrow';
 *
 * const result = Result.pipe(
 *   Result.succeed(42),
 *   Result.inspectError((error) => console.log('Debug error:', error)),
 * );
 * // No console output
 * // Result: { type: 'Success', value: 42 }
 * ```
 *
 * @see {@link pipe} - It is recommended to use this function with the {@link pipe} function for better readability and composability.
 *
 * @category Combinators
 */
export const inspectError: {
  <R1 extends ResultMaybeAsync<any, any>, R2>(fn: (a: InferFailure<R1>) => R2): (result: R1) => ResultFor<R1 | R2, InferSuccess<R1>, InferFailure<R1>>;
  <F extends (a: any) => unknown>(fn: F): <R1 extends ResultMaybeAsync<any, Parameters<F>[0]>>(result: R1) => ResultFor<R1 | ReturnType<F>, InferSuccess<R1>, InferFailure<R1>>;
} = <R1 extends ResultMaybeAsync<any, any>, R2>(fn: (a: InferFailure<R1>) => R2) => {
  return (result: R1) => {
    const apply = (r: Result<InferSuccess<R1>, InferFailure<R1>>): any => {
      if (isFailure(r)) {
        const next = fn(r.error);
        if (isPromise(next)) {
          return next.then(() => r);
        }
      }
      return r;
    };

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return isPromise(result) ? result.then(apply) : apply(result);
  };
};
