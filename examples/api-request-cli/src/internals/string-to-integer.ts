import { Result } from '@praha/byethrow';

export const stringToInteger = (value: string): Result.Result<number, TypeError> => {
  const parsed = Number(value);
  if (Number.isNaN(parsed)) {
    return Result.fail(new TypeError('The value is not a number'));
  }

  if (!Number.isInteger(parsed)) {
    return Result.fail(new TypeError('The value is not an integer'));
  }

  return Result.succeed(parsed);
};
