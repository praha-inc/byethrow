/* eslint-disable @typescript-eslint/no-explicit-any */

import { fail } from './fail';
import { succeed } from './succeed';
import { isPromise } from '../internals/helpers/is-promise';

import type { Result } from '../result';
import type { StandardSchemaV1 } from '@standard-schema/spec';

/**
 * Parses a value using a {@link https://github.com/standard-schema/standard-schema Standard Schema} compatible schema.
 * Returns a {@link Result} with the parsed value on success or validation errors on failure.
 *
 * @function
 * @typeParam S - The Standard Schema V1 compatible schema type.
 * @returns A {@link Result} with the parsed value or validation errors.
 *
 * @example Basic Usage
 * ```ts
 * import { Result } from '@praha/byethrow';
 * import { z } from 'zod';
 *
 * const schema = z.object({ name: z.string() });
 * const result = Result.parse(schema, { name: 'John' });
 * // Result.Result<{ name: string }, ReadonlyArray<StandardSchemaV1.Issue>>
 * ```
 *
 * @example Curried Usage
 * ```ts
 * import { Result } from '@praha/byethrow';
 * import { z } from 'zod';
 *
 * const schema = z.object({ name: z.string() });
 * const parser = Result.parse(schema);
 * const result = parser({ name: 'John' });
 * // Result.Result<{ name: string }, ReadonlyArray<StandardSchemaV1.Issue>>
 * ```
 *
 * @category Utilities
 */
export const parse: {
  <S extends StandardSchemaV1>(schema: S): (value: unknown) => Result<StandardSchemaV1.InferOutput<S>, ReadonlyArray<StandardSchemaV1.Issue>>;
  <S extends StandardSchemaV1>(schema: S, value: unknown): Result<StandardSchemaV1.InferOutput<S>, ReadonlyArray<StandardSchemaV1.Issue>>;
} = <S extends StandardSchemaV1>(schema: S, ...args: unknown[]): any => {
  const apply = (input: unknown) => {
    const result = schema['~standard']['validate'](input);
    if (isPromise(result)) {
      // @see: https://github.com/standard-schema/standard-schema/issues/22#issuecomment-2555546182
      throw new TypeError('Schema validation must be synchronous');
    }
    return result.issues ? fail(result.issues) : succeed(result.value);
  };

  return args.length <= 0 ? apply : apply(args[0]);
};
