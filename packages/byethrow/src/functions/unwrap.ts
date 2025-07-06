/* eslint-disable @typescript-eslint/no-explicit-any */

import { isFailure } from './is-failure';
import { isResult } from './is-result';
import { isPromise } from '../internals/helpers/is-promise';

import type { HasPromise } from '../internals/types/has-promise';
import type { InferFailure, InferSuccess, Result, ResultMaybeAsync } from '../result';

/**
 * Extracts the success value from a {@link Result} or {@link ResultAsync}.
 *
 * If the input is a {@link Failure}, it will throw the error or return the default value if provided.
 *
 * @function
 * @typeParam R - The input {@link Result} or {@link ResultAsync}.
 * @typeParam T - The default value type (optional).
 *
 * @example Success Case (without default)
 * ```ts
 * import { Result } from '@praha/byethrow';
 *
 * const result = Result.succeed(42);
 * const value = Result.unwrap(result); // 42
 * ```
 *
 * @example Success Case (with default)
 * ```ts
 * import { Result } from '@praha/byethrow';
 *
 * const result = Result.succeed(42);
 * const value = Result.unwrap(result, 0); // 42
 * ```
 *
 * @example Failure Case (without default) - throws error
 * ```ts
 * import { Result } from '@praha/byethrow';
 *
 * const result = Result.fail('error');
 * Result.unwrap(result); // throws 'error'
 * ```
 *
 * @example Failure Case (with default)
 * ```ts
 * import { Result } from '@praha/byethrow';
 *
 * const result = Result.fail('error');
 * const value = Result.unwrap(result, 0); // 0
 * ```
 *
 * @see {@link assertSuccess} - When used with {@link assertSuccess}, you can safely unwrap the {@link Result}.
 *
 * @category Unwraps
 */
export const unwrap: {
  <R extends ResultMaybeAsync<any, any>>(result: R): true extends HasPromise<R> ? Promise<InferSuccess<R>> : InferSuccess<R>;
  <R extends ResultMaybeAsync<any, any>, T>(result: R, defaultValue: T): true extends HasPromise<R> ? Promise<InferSuccess<R> | T> : InferSuccess<R> | T;
  <R extends ResultMaybeAsync<any, any>>(): (result: R) => true extends HasPromise<R> ? Promise<InferSuccess<R>> : InferSuccess<R>;
  <R extends ResultMaybeAsync<any, any>, T>(defaultValue: T): (result: R) => true extends HasPromise<R> ? Promise<InferSuccess<R> | T> : InferSuccess<R> | T;
} = <R extends ResultMaybeAsync<any, any>, T = never>(...args: any[]): any => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const firstArgument = args[0];

  if (isResult<InferSuccess<R>, InferFailure<R>>(firstArgument) || isPromise(firstArgument)) {
    const result = firstArgument;
    const hasDefault = args.length === 2;
    const defaultValue = hasDefault ? (args[1] as T) : undefined;

    const apply = (r: Result<InferSuccess<R>, InferFailure<R>>): InferSuccess<R> | T => {
      if (isFailure(r)) {
        if (hasDefault) return defaultValue as T;
        throw new Error(String(r.error));
      }
      return r.value;
    };
    return isPromise(result) ? result.then(apply) : apply(result);
  }

  // Return curried function
  const hasDefault = args.length === 1;
  const defaultValue = hasDefault ? (args[0] as T) : undefined;

  return (result: R) => {
    const apply = (r: Result<InferSuccess<R>, InferFailure<R>>): InferSuccess<R> | T => {
      if (isFailure(r)) {
        if (hasDefault) return defaultValue as T;
        throw new Error(String(r.error));
      }
      return r.value;
    };
    return isPromise(result) ? result.then(apply) : apply(result);
  };
};
