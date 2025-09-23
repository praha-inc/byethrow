import fs from 'node:fs/promises';

import { Result } from '@praha/byethrow';
import { ErrorFactory } from '@praha/error-factory';

export class ReadFileError extends ErrorFactory({
  name: 'ReadFileError',
  message: 'Failed to read file',
}) {}

export const readFile = Result.try({
  try: (path: string) => fs.readFile(path, 'utf8'),
  catch: (error) => new ReadFileError({ cause: error }),
});
