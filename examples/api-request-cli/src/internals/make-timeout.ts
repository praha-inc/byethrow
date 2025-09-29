import { Result } from '@praha/byethrow';
import { ErrorFactory } from '@praha/error-factory';

export class TimeoutError extends ErrorFactory({
  name: 'TimeoutError',
  message: ({ ms }) => `Operation timed out after ${ms} ms`,
  fields: ErrorFactory.fields<{ ms: number }>(),
}) {}

export const makeTimeout = async (ms: number): Result.ResultAsync<never, TimeoutError> => {
  return new Promise((resolve) => setTimeout(resolve, ms)).then(() => {
    return Result.fail(new TimeoutError({ ms }));
  });
};
