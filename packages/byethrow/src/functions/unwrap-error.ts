/* eslint-disable @typescript-eslint/no-explicit-any */

import { isResult } from './is-result';
import { isSuccess } from './is-success';
import { isPromise } from '../internals/helpers/is-promise';

import type { HasPromise } from '../internals/types/has-promise';
import type { InferFailure, InferSuccess, Result, ResultMaybeAsync } from '../result';

/**
 * Extracts the error value from a {@link Result} or {@link ResultAsync}.
 *
 * If the input is a {@link Success}, it will throw the success value or return the default value if provided.
 *
 * @function
 * @typeParam R - The input {@link Result} or {@link ResultAsync}.
 * @typeParam T - The default value type (optional).
 *
 * @example Failure Case (without default)
 * ```ts
 * import { Result } from '@praha/byethrow';
 *
 * const result: Result.Result<number, string> = Result.fail('Oops');
 * const error = Result.unwrapError(result); // 'Oops'
 * ```
 *
 * @example Failure Case (with default)
 * ```ts
 * import { Result } from '@praha/byethrow';
 *
 * const result: Result.Result<number, string> = Result.fail('Oops');
 * const error = Result.unwrapError(result, 'default'); // 'Oops'
 * ```
 *
 * @example Success Case (without default)
 * ```ts
 * import { Result } from '@praha/byethrow';
 *
 * const result: Result.Result<number, string> = Result.succeed(100);
 * const error = Result.unwrapError(result); // throws 100
 * ```
 *
 * @example Success Case (with default)
 * ```ts
 * import { Result } from '@praha/byethrow';
 *
 * const result: Result.Result<number, string> = Result.succeed(100);
 * const error = Result.unwrapError(result, 0); // 0
 * ```
 *
 * @see {@link assertFailure} - When used with {@link assertFailure}, you can safely unwrap the {@link Result}.
 *
 * @category Unwraps
 */
export const unwrapError: {
  <R extends ResultMaybeAsync<any, any>>(result: R): true extends HasPromise<R> ? Promise<InferFailure<R>> : InferFailure<R>;
  <R extends ResultMaybeAsync<any, any>, T>(result: R, defaultValue: T): true extends HasPromise<R> ? Promise<InferFailure<R> | T> : InferFailure<R> | T;
  <R extends ResultMaybeAsync<any, any>>(): (result: R) => true extends HasPromise<R> ? Promise<InferFailure<R>> : InferFailure<R>;
  <R extends ResultMaybeAsync<any, any>, T>(defaultValue: T): (result: R) => true extends HasPromise<R> ? Promise<InferFailure<R> | T> : InferFailure<R> | T;
} = <R extends ResultMaybeAsync<any, any>, T = never>(...args: any[]): any => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const firstArgument = args[0];

  if (isResult<InferSuccess<R>, InferFailure<R>>(firstArgument) || isPromise(firstArgument)) {
    const result = firstArgument;
    const hasDefault = args.length === 2;
    const defaultValue = hasDefault ? (args[1] as T) : undefined;

    const apply = (r: Result<InferSuccess<R>, InferFailure<R>>): InferFailure<R> | T => {
      if (isSuccess(r)) {
        if (hasDefault) return defaultValue as T;
        // eslint-disable-next-line @typescript-eslint/only-throw-error
        throw r.value;
      }
      return r.error;
    };
    return isPromise(result) ? result.then(apply) : apply(result);
  }

  // Return curried function
  const hasDefault = args.length === 1;
  const defaultValue = hasDefault ? (args[0] as T) : undefined;

  return (result: R) => {
    const apply = (r: Result<InferSuccess<R>, InferFailure<R>>): InferFailure<R> | T => {
      if (isSuccess(r)) {
        if (hasDefault) return defaultValue as T;
        // eslint-disable-next-line @typescript-eslint/only-throw-error
        throw r.value;
      }
      return r.error;
    };
    return isPromise(result) ? result.then(apply) : apply(result);
  };
};
