# Parse package.json

```ts
import fs from 'node:fs/promises';

import { ErrorFactory } from '@praha/error-factory';
import { Result } from '@praha/byethrow';
import { z } from 'zod';

class ReadFileError extends ErrorFactory({
  name: 'ReadFileError',
  message: 'Failed to read file',
}) {}

const readFile = Result.try({
  try: (path: string) => fs.readFile(path, 'utf-8'),
  catch: (error) => new ReadFileError({ cause: error }),
});

class ParsePackageJsonError extends ErrorFactory({
  name: 'ParsePackageJsonError',
  message: 'Failed to parse package.json',
}) {}

const parsePackageJson = (data: string) => Result.pipe(
  data,
  Result.parse(z.object({
    name: z.string(),
    version: z.string(),
  })),
  Result.mapError((error) => new ParsePackageJsonError({ cause: error })),
);

const result = await Result.pipe(
  readFile('./package.json'),
  Result.andThen(parsePackageJson),
  Result.map((packageJson) => `${packageJson.name}@${packageJson.version}`),
);

if (Result.isSuccess(result)) {
  console.log(result.value);
  //          ^?

} else {
  console.error(result.error);
  //            ^?
}
```
