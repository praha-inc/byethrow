/**
 * Re-exports core Result-handling utilities under two convenient namespaces:
 *
 * - `Result`: Verbose and explicit usage
 * - `R`: Shorthand alias for more concise code
 *
 * @example Basic Usage
 * ```ts
 * import { Result } from '@praha/byethrow';
 *
 * const validateId = (id: string) => {
 *   if (!id.startsWith('u')) {
 *     return Result.fail(new Error('Invalid ID format'));
 *   }
 *   return Result.succeed();
 * };
 *
 * const findUser = Result.fn({
 *   try: (id: string) => {
 *     return { id, name: 'John Doe' };
 *   },
 *   catch: (error) => new Error('Failed to find user', { cause: error }),
 * });
 *
 * const result = Result.pipe(
 *   Result.succeed('u123'),
 *   Result.andThrough(validateId),
 *   Result.andThen(findUser),
 * );
 *
 * if (Result.isSuccess(result)) {
 *   console.log(result.value); // User found: John Doe
 * }
 * ```
 *
 * @example Shorthand Usage
 * ```ts
 * import { R } from '@praha/byethrow';
 *
 * const validateId = (id: string) => {
 *   if (!id.startsWith('u')) {
 *     return R.fail(new Error('Invalid ID format'));
 *   }
 *   return R.succeed();
 * };
 *
 * const findUser = R.fn({
 *   try: (id: string) => {
 *     return { id, name: 'John Doe' };
 *   },
 *   catch: (error) => new Error('Failed to find user', { cause: error }),
 * });
 *
 * const result = R.pipe(
 *   R.succeed('u123'),
 *   R.andThrough(validateId),
 *   R.andThen(findUser),
 * );
 *
 * if (R.isSuccess(result)) {
 *   console.log(result.value); // User found: John Doe
 * }
 * ```
 */
export * as Result from './exports';

/**
 * Shorthand alias for {@link Result}.
 */
export * as R from './exports';
