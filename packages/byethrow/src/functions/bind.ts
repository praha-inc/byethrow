/* eslint-disable @typescript-eslint/no-explicit-any */

import { isFailure } from './is-failure';
import { succeed } from './succeed';
import { isPromise } from '../internals/helpers/is-promise';

import type { InferFailure, InferSuccess, Result, ResultFor, ResultMaybeAsync } from '../result';

/**
 * Chains another {@link Result}-producing computation and **merges its success value**
 * into the existing object under the specified key.
 *
 * - If the original result is a {@link Failure}, it is returned as-is.
 * - If the next result is a {@link Failure}, it is returned as-is.
 * - If both are {@link Success}, a new object is returned by shallow-merging:
 *   the original success object and `{ [name]: nextSuccess }`.
 *
 * This is useful for building up objects in a compositional and type-safe way,
 * especially in validation or data-fetching pipelines.
 *
 * @function
 * @typeParam N - The key to assign the result of the `fn` computation.
 * @typeParam R1 - The input {@link Result} or {@link ResultAsync}.
 * @typeParam R2 - The result type returned by `fn`.
 *
 * @example Success Case
 * ```ts
 * import { Result } from '@praha/byethrow';
 *
 * const result = Result.pipe(
 *   Result.succeed({ name: 'Alice' }),
 *   Result.bind('age', (user) => Result.succeed(20)),
 * );
 * // { type: 'Success', value: { name: 1, age: 20 } }
 * ```
 *
 * @example Failure Case (input is a Failure)
 * ```ts
 * import { Result } from '@praha/byethrow';
 *
 * const result = Result.pipe(
 *   Result.fail('error'),
 *   Result.bind('age', (user) => Result.succeed(20)),
 * );
 * // { type: 'Failure', error: 'error' }
 * ```
 *
 * @example Failure Case (function returns a Failure)
 * ```ts
 * import { Result } from '@praha/byethrow';
 *
 * const result = Result.pipe(
 *   Result.succeed({ name: 'Alice' }),
 *   Result.bind('age', (user) => Result.fail('error')),
 * );
 * // { type: 'Failure', error: 'error' }
 * ```
 *
 * @see {@link pipe} - It is recommended to use this function with the {@link pipe} function for better readability and composability.
 *
 * @category Combinators
 */
export const bind: {
  <N extends string, R1 extends ResultMaybeAsync<any, any>, R2 extends ResultMaybeAsync<any, any>>(name: N, fn: (a: InferSuccess<R1>) => R2): (result: R1) => InferSuccess<R1> extends object ? ResultFor<R1 | R2, { [K in N | keyof InferSuccess<R1>]: K extends Exclude<keyof InferSuccess<R1>, N> ? InferSuccess<R1>[K] : InferSuccess<R2> }, InferFailure<R1> | InferFailure<R2>> : unknown;
  <N extends string, F extends (a: any) => ResultMaybeAsync<any, any>>(name: N, fn: F): <R1 extends ResultMaybeAsync<Parameters<F>[0], any>>(result: R1) => Parameters<F>[0] extends object ? ResultFor<R1 | ReturnType<F>, { [K in N | keyof Parameters<F>[0]]: K extends Exclude<keyof Parameters<F>[0], N> ? Parameters<F>[0][K] : InferSuccess<F> }, InferFailure<R1> | InferFailure<F>> : unknown;
} = <N extends string, T1 extends object, T2, E2>(name: N, fn: (a: T1) => ResultMaybeAsync<T2, E2>) => {
  return <E1>(result: ResultMaybeAsync<T1, E1>) => {
    const apply = (r: Result<T1, E1>) => {
      if (isFailure(r)) return r;
      const fr = fn(r.value);

      const attach = (fr: Result<T2, E2>) => {
        return isFailure(fr) ? fr : succeed<unknown>({ ...r.value, [name]: fr.value });
      };

      return isPromise(fr) ? fr.then(attach) : attach(fr);
    };

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return (isPromise(result) ? result.then(apply) : apply(result)) as any;
  };
};
