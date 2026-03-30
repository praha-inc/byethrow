import dedent from 'dedent';

import { ruleTester } from '../tester';
import { consistentNamespace } from './consistent-namespace';

ruleTester.run(
  'consistent-namespace',
  consistentNamespace,
  {
    valid: [
      // Default option ("Result")
      {
        code: dedent`
          import { Result } from '@praha/byethrow';

          type Test = Result.Result<string, TypeError>;
        `,
      },

      // Explicit "R" option
      {
        code: dedent`
          import { R } from '@praha/byethrow';

          type Test = R.Result<string, TypeError>;
        `,
        options: ['R'],
      },

      // Non-byethrow imports should not trigger
      {
        code: dedent`
          import { R } from 'other-package';

          type Test = R.Result<string, TypeError>;
        `,
      },
      {
        code: dedent`
          import { R } from 'other-package';

          type Test = R.Result<string, TypeError>;
        `,
        options: ['Result'],
      },
    ],
    invalid: [
      // Default ("Result"): using R
      {
        code: dedent`
          import { R } from '@praha/byethrow';

          type Test = R.Result<string, TypeError>;
        `,
        output: dedent`
          import { Result } from '@praha/byethrow';

          type Test = Result.Result<string, TypeError>;
        `,
        errors: [{
          message: 'Use `Result` instead of `R` as the byethrow namespace.',
          line: 1,
          column: 9,
        }],
      },

      // Explicit "R": using Result
      {
        code: dedent`
          import { Result } from '@praha/byethrow';

          type Test = Result.Result<string, TypeError>;
        `,
        options: ['R'],
        output: dedent`
          import { R } from '@praha/byethrow';

          type Test = R.Result<string, TypeError>;
        `,
        errors: [{
          message: 'Use `R` instead of `Result` as the byethrow namespace.',
          line: 1,
          column: 9,
        }],
      },

      // Both imported: remove trailing specifier
      {
        code: dedent`
          import { Result, R } from '@praha/byethrow';

          type Test1 = Result.Result<string, TypeError>;
          type Test2 = R.Result<string, TypeError>;
        `,
        output: dedent`
          import { Result } from '@praha/byethrow';

          type Test1 = Result.Result<string, TypeError>;
          type Test2 = Result.Result<string, TypeError>;
        `,
        errors: [{
          message: 'Use `Result` instead of `R` as the byethrow namespace.',
          line: 1,
          column: 17,
        }],
      },

      // Both imported: remove leading specifier
      {
        code: dedent`
          import { R, Result } from '@praha/byethrow';

          type Test1 = R.Result<string, TypeError>;
          type Test2 = Result.Result<string, TypeError>;
        `,
        output: dedent`
          import { Result } from '@praha/byethrow';

          type Test1 = Result.Result<string, TypeError>;
          type Test2 = Result.Result<string, TypeError>;
        `,
        errors: [{
          message: 'Use `Result` instead of `R` as the byethrow namespace.',
          line: 1,
          column: 9,
        }],
      },

      // Both imported with explicit "R": remove leading specifier
      {
        code: dedent`
          import { Result, R } from '@praha/byethrow';

          type Test1 = Result.Result<string, TypeError>;
          type Test2 = R.Result<string, TypeError>;
        `,
        options: ['R'],
        output: dedent`
          import { R } from '@praha/byethrow';

          type Test1 = R.Result<string, TypeError>;
          type Test2 = R.Result<string, TypeError>;
        `,
        errors: [{
          message: 'Use `R` instead of `Result` as the byethrow namespace.',
          line: 1,
          column: 9,
        }],
      },
    ],
  },
);
