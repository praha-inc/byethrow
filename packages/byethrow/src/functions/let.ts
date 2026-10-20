/* oxlint-disable @typescript-eslint/no-explicit-any */

import { isFailure } from './is-failure';
import { succeed } from './succeed';
import { isPromise } from '../internals/helpers/is-promise';

import type { InferFailure, InferSuccess, Result, ResultFor, ResultMaybeAsync } from '../result';

/**
 * Computes a **plain value** from the current success object and attaches it
 * to the existing object under the specified key.
 *
 * - If the original result is a {@link Failure}, it is returned as-is.
 * - If the original result is a {@link Success}, a new object is returned by shallow-merging:
 *   the original success object and `{ [name]: fn(value) }`.
 *
 * This is the companion of {@link bind} for derivations that cannot fail.
 * `fn` is expected to be a pure, synchronous computation.
 * Use {@link bind} instead when the value comes from a fallible or asynchronous computation.
 *
 * @typeParam N - The key to assign the result of the `fn` computation.
 * @typeParam R1 - The input {@link Result} or {@link ResultAsync}.
 * @typeParam T2 - The value type returned by `fn`.
 *
 * @example Success Case
 * ```ts
 * import { Result } from '@praha/byethrow';
 *
 * const result = Result.pipe(
 *   Result.succeed({ firstName: 'Alice', lastName: 'Smith' }),
 *   Result.let('fullName', ({ firstName, lastName }) => `${firstName} ${lastName}`),
 * );
 * // { type: 'Success', value: { firstName: 'Alice', lastName: 'Smith', fullName: 'Alice Smith' } }
 * ```
 *
 * @example Failure Case
 * ```ts
 * import { Result } from '@praha/byethrow';
 *
 * const result = Result.pipe(
 *   Result.fail('error'),
 *   Result.let('fullName', ({ firstName, lastName }) => `${firstName} ${lastName}`),
 * );
 * // { type: 'Failure', error: 'error' }
 * ```
 *
 * @example Combined with bind
 * ```ts
 * import { Result } from '@praha/byethrow';
 *
 * const result = Result.pipe(
 *   Result.do(),
 *   Result.bind('x', () => Result.succeed(1)),
 *   Result.bind('y', () => Result.succeed(2)),
 *   Result.let('z', ({ x, y }) => x + y),
 * );
 * // { type: 'Success', value: { x: 1, y: 2, z: 3 } }
 * ```
 *
 * @see {@link pipe} - It is recommended to use this function with the {@link pipe} function for better readability and composability.
 * @see {@link bind} - Use this function instead when the value is computed by a {@link Result}-producing function.
 *
 * @category Combinators
 */
function let_<N extends string, R1 extends ResultMaybeAsync<any, any>, const T2>(name: N, fn: (a: InferSuccess<R1>) => T2): (result: R1) => InferSuccess<R1> extends object ? ResultFor<R1, { [K in N | keyof InferSuccess<R1>]: K extends Exclude<keyof InferSuccess<R1>, N> ? InferSuccess<R1>[K] : T2 }, InferFailure<R1>> : unknown;
function let_<N extends string, T1, const T2>(name: N, fn: (a: T1) => T2): <R1 extends ResultMaybeAsync<T1, any>>(result: R1) => T1 extends object ? ResultFor<R1, { [K in N | keyof T1]: K extends Exclude<keyof T1, N> ? T1[K] : T2 }, InferFailure<R1>> : unknown;
function let_<N extends string, T1 extends object, T2>(name: N, fn: (a: T1) => T2) {
  return <E1>(result: ResultMaybeAsync<T1, E1>) => {
    const apply = (r: Result<T1, E1>) => {
      if (isFailure(r)) return r;
      return succeed<unknown>({ ...r.value, [name]: fn(r.value) });
    };

    // oxlint-disable-next-line @typescript-eslint/no-unsafe-return
    return (isPromise(result) ? result.then(apply) : apply(result)) as any;
  };
}

export { let_ as let };
