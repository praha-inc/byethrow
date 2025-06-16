/**
 * Re-exports core Result-handling utilities under two convenient namespaces:
 *
 * - `Result`: Verbose and explicit usage
 * - `R`: Shorthand alias for more concise code
 *
 * @example Basic Usage
 * ```ts
 * import { Result } from './path/to/module';
 *
 * const result = Result.succeed(123);
 * if (Result.isSuccess(result)) {
 *   console.log(Result.unwrap(result)); // 123
 * }
 * ```
 *
 * @example Shorthand Usage
 * ```ts
 * import { R } from './path/to/module';
 *
 * const result = R.succeed(123);
 * if (R.isSuccess(result)) {
 *   console.log(R.unwrap(result)); // 123
 * }
 * ```
 */
export * as Result from './exports';

/**
 * Shorthand alias for {@link Result}.
 */
export * as R from './exports';
