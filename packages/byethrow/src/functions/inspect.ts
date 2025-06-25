/* eslint-disable @typescript-eslint/no-explicit-any */

import { isSuccess } from './is-success';
import { isPromise } from '../internals/helpers/is-promise';

import type { InferFailure, InferSuccess, Result, ResultMaybeAsync } from '../result';

/**
 * Executes a side effect function on the success value of a {@link Result} or {@link ResultAsync},
 * without modifying the original result. This is useful for debugging, logging, or performing
 * other side effects while maintaining the original value and error state.
 *
 * @function
 * @typeParam R1 - The input {@link Result} or {@link ResultAsync}.
 * @typeParam R2 - The return type of the inspection function.
 *
 * @example Success Case
 * ```ts
 * import { Result } from '@praha/byethrow';
 *
 * const result = Result.pipe(
 *   Result.succeed(42),
 *   Result.inspect((value) => console.log('Debug:', value)),
 * );
 * // Console output: "Debug: 42"
 * // Result: { type: 'Success', value: 42 }
 * ```
 *
 * @example Failure Case
 * ```ts
 * import { Result } from '@praha/byethrow';
 *
 * const result = Result.pipe(
 *   Result.fail('error'),
 *   Result.inspect((value) => console.log('Debug:', value)),
 * );
 * // No console output
 * // Result: { type: 'Failure', error: 'error' }
 * ```
 *
 * @see {@link pipe} - It is recommended to use this function with the {@link pipe} function for better readability and composability.
 *
 * @category Combinators
 */
export const inspect: {
  <R1 extends ResultMaybeAsync<any, any>>(fn: (a: InferSuccess<R1>) => unknown): (result: R1) => R1;
  <F extends (a: any) => unknown>(fn: F): <R1 extends ResultMaybeAsync<Parameters<F>[0], any>>(result: R1) => R1;
} = <R1 extends ResultMaybeAsync<any, any>, R2>(fn: (a: InferSuccess<R1>) => R2) => {
  return (result: R1) => {
    const apply = (r: Result<InferSuccess<R1>, InferFailure<R1>>): any => {
      if (isSuccess(r)) fn(r.value);
      return r;
    };

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return isPromise(result) ? result.then(apply) : apply(result);
  };
};
