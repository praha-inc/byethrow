import dedent from 'dedent';

import { ruleTester } from '../tester';
import { noNegatedTypeGuards } from './no-negated-type-guards';

ruleTester.run(
  'no-negated-on-type-guard',
  noNegatedTypeGuards,
  {
    valid: [
      // Not using negation
      {
        code: dedent`
          import { Result } from '@praha/byethrow';

          Result.isSuccess(result);
        `,
      },
      {
        code: dedent`
          import { Result } from '@praha/byethrow';

          Result.isFailure(result);
        `,
      },
      {
        code: dedent`
          import { R } from '@praha/byethrow';

          R.isSuccess(result);
        `,
      },
      {
        code: dedent`
          import { R } from '@praha/byethrow';

          R.isFailure(result);
        `,
      },

      // Non-byethrow calls should not trigger
      {
        code: dedent`
          !isSuccess(result);
        `,
      },
      {
        code: dedent`
          !isFailure(result);
        `,
      },
      {
        code: dedent`
          import { Result } from 'other-package';

          !Result.isSuccess(result);
        `,
      },
      {
        code: dedent`
          import { Result } from 'other-package';

          !Result.isFailure(result);
        `,
      },
    ],
    invalid: [
      // !Result.isSuccess(result)
      {
        code: dedent`
          import { Result } from '@praha/byethrow';

          !Result.isSuccess(result)
        `,
        output: dedent`
          import { Result } from '@praha/byethrow';

          Result.isFailure(result)
        `,
        errors: [{
          message: 'Use `Result.isFailure(result)` instead of `!Result.isSuccess(result)`.',
          line: 3,
          column: 0,
        }],
      },
      {
        code: dedent`
          import { R } from '@praha/byethrow';

          !R.isSuccess(result)
        `,
        output: dedent`
          import { R } from '@praha/byethrow';

          R.isFailure(result)
        `,
        errors: [{
          message: 'Use `R.isFailure(result)` instead of `!R.isSuccess(result)`.',
          line: 3,
          column: 0,
        }],
      },

      // !Result.isFailure(result)
      {
        code: dedent`
          import { Result } from '@praha/byethrow';

          !Result.isFailure(result)
        `,
        output: dedent`
          import { Result } from '@praha/byethrow';

          Result.isSuccess(result)
        `,
        errors: [{
          message: 'Use `Result.isSuccess(result)` instead of `!Result.isFailure(result)`.',
          line: 3,
          column: 0,
        }],
      },
      {
        code: dedent`
          import { R } from '@praha/byethrow';

          !R.isFailure(result)
        `,
        output: dedent`
          import { R } from '@praha/byethrow';

          R.isSuccess(result)
        `,
        errors: [{
          message: 'Use `R.isSuccess(result)` instead of `!R.isFailure(result)`.',
          line: 3,
          column: 0,
        }],
      },

      // used in if condition
      {
        code: dedent`
          import { Result } from '@praha/byethrow';

          if (!Result.isSuccess(result)) {}
        `,
        output: dedent`
          import { Result } from '@praha/byethrow';

          if (Result.isFailure(result)) {}
        `,
        errors: [{
          message: 'Use `Result.isFailure(result)` instead of `!Result.isSuccess(result)`.',
          line: 3,
          column: 4,
        }],
      },
      {
        code: dedent`
          import { R } from '@praha/byethrow';

          if (!R.isSuccess(result)) {}
        `,
        output: dedent`
          import { R } from '@praha/byethrow';

          if (R.isFailure(result)) {}
        `,
        errors: [{
          message: 'Use `R.isFailure(result)` instead of `!R.isSuccess(result)`.',
          line: 3,
          column: 4,
        }],
      },
      {
        code: dedent`
          import { Result } from '@praha/byethrow';

          if (!Result.isFailure(result)) {}
        `,
        output: dedent`
          import { Result } from '@praha/byethrow';

          if (Result.isSuccess(result)) {}
        `,
        errors: [{
          message: 'Use `Result.isSuccess(result)` instead of `!Result.isFailure(result)`.',
          line: 3,
          column: 4,
        }],
      },
      {
        code: dedent`
          import { R } from '@praha/byethrow';

          if (!R.isFailure(result)) {}
        `,
        output: dedent`
          import { R } from '@praha/byethrow';

          if (R.isSuccess(result)) {}
        `,
        errors: [{
          message: 'Use `R.isSuccess(result)` instead of `!R.isFailure(result)`.',
          line: 3,
          column: 4,
        }],
      },
    ],
  },
);
