import { Result } from '@praha/byethrow';
import { ErrorFactory } from '@praha/error-factory';
import { z } from 'zod';

const schema = z.object({
  name: z.string(),
  version: z.string().optional(),
});

export class ParsePackageJsonError extends ErrorFactory({
  name: 'ParsePackageJsonError',
  message: 'Failed to parse package.json',
}) {}

export const parsePackageJson = (data: string) => Result.pipe(
  Result.try({
    immediate: true,
    try: () => JSON.parse(data) as unknown,
    catch: (error) => error,
  }),
  Result.andThen(Result.parse(schema)),
  Result.mapError((error) => new ParsePackageJsonError({ cause: error })),
);
