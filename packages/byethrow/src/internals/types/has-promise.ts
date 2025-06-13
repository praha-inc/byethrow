/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Determines whether the given type `T` is a `Promise`.
 *
 * Returns `true` if `T` extends `Promise<unknown>`, otherwise `false`.
 *
 * @typeParam T - The type to test.
 *
 * @example
 * ```ts
 * type A = HasPromise<Promise<number>>; // true
 * type B = HasPromise<Promise<string> | number>; // true
 * type C = HasPromise<number>; // false
 * type D = HasPromise<{}>; // false
 * type E = HasPromise<[]>; // true
 * ```
 */
export type HasPromise<T> = object extends T ? false : Promise<any> extends T ? true : false;
