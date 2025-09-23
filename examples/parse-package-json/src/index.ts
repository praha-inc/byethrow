import { Result } from '@praha/byethrow';
import { match } from 'ts-pattern';

import { parsePackageJson } from './internals/parse-package-json';
import { readFile } from './internals/read-file';

await Result.pipe(
  readFile('./package.json'),
  Result.andThen(parsePackageJson),
  Result.inspect((packageJson) => {
    console.log('Package name:', packageJson.name);
    console.log('Package version:', packageJson.version || 'N/A');
  }),
  Result.inspectError((error) => {
    process.exitCode = 1;
    match(error)
      .with({ name: 'ReadFileError' }, () => {
        console.log('Failed to read package.json file. Please ensure the file exists and is accessible.');
      })
      .with({ name: 'ParsePackageJsonError' }, () => {
        console.log('Failed to parse package.json. Please ensure the file contains valid JSON.');
      })
      .exhaustive();
  }),
);
