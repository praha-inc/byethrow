/* eslint-disable @typescript-eslint/no-explicit-any */

import type { HasPromise } from './internals/types/has-promise';

/**
 * Represents a successful result.
 *
 * @typeParam T - The type of the successful value.
 *
 * @example
 * ```ts
 * import { Result } from '@praha/byethrow';
 *
 * const success: Result.Success<number> = {
 *   type: 'Success',
 *   value: 42,
 * };
 * ```
 *
 * @category Core Types
 */
export type Success<T> = {
  readonly type: 'Success';
  readonly value: T;
};

/**
 * Represents a failed result.
 *
 * @typeParam E - The type of the error.
 *
 * @example
 * ```ts
 * import { Result } from '@praha/byethrow';
 *
 * const failure: Result.Failure<string> = {
 *   type: 'Failure',
 *   error: 'Something went wrong',
 * };
 * ```
 *
 * @category Core Types
 */
export type Failure<E> = {
  readonly type: 'Failure';
  readonly error: E;
};

/**
 * A union type representing either a success or a failure.
 *
 * @typeParam T - The type of the {@link Success} value.
 * @typeParam E - The type of the {@link Failure} value.
 *
 * @example
 * ```ts
 * import { Result } from '@praha/byethrow';
 *
 * const doSomething = (): Result.Result<number, string> => {
 *   return Math.random() > 0.5
 *     ? { type: 'Success', value: 10 }
 *     : { type: 'Failure', error: 'Oops' };
 * };
 * ```
 *
 * @category Core Types
 */
export type Result<T, E> = Success<T> | Failure<E>;

/**
 * An asynchronous variant of {@link Result}, wrapped in a `Promise`.
 *
 * @typeParam T - The type of the {@link Success} value.
 * @typeParam E - The type of the {@link Failure} value.
 *
 * @example
 * ```ts
 * import { Result } from '@praha/byethrow';
 *
 * const fetchData = async (): Result.ResultAsync<string, Error> => {
 *   try {
 *     const data = await fetch('...');
 *     return { type: 'Success', value: await data.text() };
 *   } catch (err) {
 *     return { type: 'Failure', error: err as Error };
 *   }
 * };
 * ```
 *
 * @category Core Types
 */
export type ResultAsync<T, E> = Promise<Result<T, E>>;

/**
 * A result that may be either synchronous or asynchronous.
 *
 * @typeParam T - The type of the {@link Success} value.
 * @typeParam E - The type of the {@link Failure} value.
 *
 * @example Synchronous Case
 * ```ts
 * import { Result } from '@praha/byethrow';
 *
 * const result: Result.ResultMaybeAsync<number, string> = { type: 'Success', value: 10 };
 * ```
 *
 * @example Asynchronous Case
 * ```ts
 * import { Result } from '@praha/byethrow';
 *
 * const result: Result.ResultMaybeAsync<number, string> = Promise.resolve({ type: 'Failure', error: 'error' });
 * ```
 *
 * @category Core Types
 */
export type ResultMaybeAsync<T, E> = Result<T, E> | Promise<Result<T, E>>;

/**
 * Resolves to the appropriate Result type (sync or async) based on the input type.
 *
 * Typically used to conditionally infer return types based on whether the original computation was async.
 *
 * @typeParam R - The reference type to inspect for a Promise.
 * @typeParam T - The type of the {@link Success} value.
 * @typeParam E - The type of the {@link Failure} value.
 *
 * @example With a Promise-returning function
 * ```ts
 * import { Result } from '@praha/byethrow';
 *
 * type R = Result.ResultAsync<number, string>;
 * type Output = Result.ResultFor<R, number, string>; // Result.ResultAsync<number, string>
 * ```
 *
 * @example With a non-Promise-returning function
 * ```ts
 * import { Result } from '@praha/byethrow';
 *
 * type R = Result.Result<number, string>;
 * type Output = Result.ResultFor<R, number, string>; // Result.Result<number, string>
 * ```
 *
 * @category Core Types
 */
export type ResultFor<R, T, E> = true extends HasPromise<R> ? ResultAsync<T, E> : Result<T, E>;

/**
 * Infers the {@link Success} value type `T` from a Result or a function returning a Result.
 *
 * @typeParam T - A {@link ResultMaybeAsync} type or a function returning it.
 *
 * @example From a result object
 * ```ts
 * import { Result } from '@praha/byethrow';
 *
 * type R = Result.Result<number, string>;
 * type SuccessValue = Result.InferSuccess<R>; // number
 * ```
 *
 * @example From a function
 * ```ts
 * import { Result } from '@praha/byethrow';
 *
 * const fn = () => Promise.resolve({ type: 'Success', value: 123 } as const);
 * type SuccessValue = Result.InferSuccess<typeof fn>; // number
 * ```
 *
 * @category Infer Types
 */
export type InferSuccess<T>
  = [T] extends [(...args: any[]) => ResultMaybeAsync<infer U, any>] ? U
    : [T] extends [ResultMaybeAsync<infer U, any>] ? U
        : never;

/**
 * Infers the {@link Failure} value type `E` from a Result or a function returning a Result.
 *
 * @typeParam T - A {@link ResultMaybeAsync} type or a function returning it.
 *
 * @example From a result object
 * ```ts
 * import { Result } from '@praha/byethrow';
 *
 * type R = Result.Result<number, string>;
 * type ErrorValue = Result.InferFailure<R>; // string
 * ```
 *
 * @example From a function
 * ```ts
 * import { Result } from '@praha/byethrow';
 *
 * const fn = () => Promise.resolve({ type: 'Failure', error: new Error() } as const);
 * type ErrorValue = Result.InferFailure<typeof fn>; // Error
 * ```
 *
 * @category Infer Types
 */
export type InferFailure<T>
  = [T] extends [(...args: any[]) => ResultMaybeAsync<any, infer U>] ? U
    : [T] extends [ResultMaybeAsync<any, infer U>] ? U
        : never;
