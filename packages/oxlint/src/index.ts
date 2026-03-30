import { eslintCompatPlugin } from '@oxlint/plugins';

import { noThrowInCallback } from './rules/no-throw-in-callback';
import { noTryCatchInCallback } from './rules/no-try-catch-in-callback';
import { preferResultAsync } from './rules/prefer-result-async';
import { preferResultMatchers } from './rules/prefer-result-matchers';

const oxlintByethrowPlugin = eslintCompatPlugin({
  meta: {
    name: 'byethrow',
  },
  rules: {
    'no-throw-in-callback': noThrowInCallback,
    'no-try-catch-in-callback': noTryCatchInCallback,
    'prefer-result-async': preferResultAsync,
    'prefer-result-matchers': preferResultMatchers,
  },
});

export default oxlintByethrowPlugin;
