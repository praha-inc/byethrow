/* oxlint-disable @typescript-eslint/no-explicit-any */

import { fail } from "./fail";
import { isFailure } from "./is-failure";
import { partition } from "./partition";
import { isPromise } from "../internals/helpers/is-promise";

import type { Result, ResultAsync, ResultMaybeAsync } from "../result";
import type { Partition } from "./partition";

/**
 * Represents a failed item from {@link partitionBy}.
 *
 * @typeParam Input - The input value type.
 * @typeParam Error - The error value type.
 */
export type BatchFailure<Input, Error> = {
  input: Input;
  reason: Error;
};

/**
 * Lifts a single-item Result function into a batched partition function.
 *
 * @function
 * @typeParam Input - The input value type.
 * @typeParam Output - The successful output value type.
 * @typeParam Error - The error value type.
 *
 * @example
 * ```ts
 * import { Result } from '@praha/byethrow';
 *
 * const parseNumber = (value: string) => {
 *   const number = Number(value);
 *   return Number.isNaN(number)
 *     ? Result.fail('invalid')
 *     : Result.succeed(number);
 * };
 *
 * const parseMany = Result.partitionBy(parseNumber);
 * const result = parseMany(['1', 'x', '2']);
 * // {
 * //   type: 'Success',
 * //   value: {
 * //     succeeded: [1, 2],
 * //     failed: [{ input: 'x', reason: 'invalid' }],
 * //   },
 * // }
 * ```
 *
 * @category Utilities
 */
export const partitionBy: {
  <Input, Output, Error>(
    fn: (input: Input) => Result<Output, Error>,
  ): (
    inputs: readonly Input[],
  ) => Result<Partition<Output, BatchFailure<Input, Error>>, never>;
  <Input, Output, Error>(
    fn: (input: Input) => ResultAsync<Output, Error>,
  ): (
    inputs: readonly Input[],
  ) => ResultAsync<Partition<Output, BatchFailure<Input, Error>>, never>;
  <Input, Output, Error>(
    fn: (input: Input) => ResultMaybeAsync<Output, Error>,
  ): (
    inputs: readonly Input[],
  ) => ResultMaybeAsync<Partition<Output, BatchFailure<Input, Error>>, never>;
} = (fn: (input: any) => ResultMaybeAsync<any, any>): any => {
  const mapFailure = (input: any, result: ResultMaybeAsync<any, any>) => {
    if (isPromise(result)) {
      return result.then((resolvedResult) => {
        if (isFailure(resolvedResult)) {
          return fail({ input, reason: resolvedResult.error });
        }

        return resolvedResult;
      });
    }

    if (isFailure(result)) {
      return fail({ input, reason: result.error });
    }

    return result;
  };

  return (inputs: readonly any[]) => {
    return partition(inputs.map((input) => mapFailure(input, fn(input))));
  };
};
