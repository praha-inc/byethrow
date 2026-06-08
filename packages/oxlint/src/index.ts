import { eslintCompatPlugin } from '@oxlint/plugins';
import { defineConfig } from 'oxlint';

import { consistentNamespace } from './rules/consistent-namespace';
import { noAmbiguousErrorType } from './rules/no-ambiguous-error-type';
import { noAmbiguousSuccessType } from './rules/no-ambiguous-success-type';
import { noNegatedTypeGuards } from './rules/no-negated-type-guards';
import { noThrowInCallback } from './rules/no-throw-in-callback';
import { noTryCatchInCallback } from './rules/no-try-catch-in-callback';
import { preferResultAsync } from './rules/prefer-result-async';
import { preferResultMatchers } from './rules/prefer-result-matchers';
import { preferResultMaybeAsync } from './rules/prefer-result-maybe-async';

import type { Plugin } from '@oxlint/plugins';
import type { OxlintConfig } from 'oxlint';

type OxlintPlugin = Plugin & { recommended: OxlintConfig };

const oxlintByethrowPlugin = eslintCompatPlugin({
  meta: {
    name: 'byethrow',
  },
  rules: {
    'consistent-namespace': consistentNamespace,
    'no-ambiguous-error-type': noAmbiguousErrorType,
    'no-ambiguous-success-type': noAmbiguousSuccessType,
    'no-negated-type-guards': noNegatedTypeGuards,
    'no-throw-in-callback': noThrowInCallback,
    'no-try-catch-in-callback': noTryCatchInCallback,
    'prefer-result-async': preferResultAsync,
    'prefer-result-matchers': preferResultMatchers,
    'prefer-result-maybe-async': preferResultMaybeAsync,
  },
}) as OxlintPlugin;

oxlintByethrowPlugin.recommended = defineConfig({
  jsPlugins: [
    {
      name: 'byethrow',
      specifier: '@praha/byethrow-oxlint',
    },
  ],
  rules: Object.fromEntries(
    Object.entries(oxlintByethrowPlugin.rules)
      .filter(([, rule]) => rule.meta?.docs?.['testing'] !== true)
      .map(([key]) => [`byethrow/${key}`, 'error' as const]),
  ),
  overrides: [
    {
      files: [
        '**/*.test.*',
        '**/*.test-d.*',
        '**/__tests__/**/*',
      ],
      jsPlugins: [
        {
          name: 'byethrow',
          specifier: '@praha/byethrow-oxlint',
        },
      ],
      rules: Object.fromEntries(
        Object.entries(oxlintByethrowPlugin.rules)
          .filter(([, rule]) => rule.meta?.docs?.['testing'] === true)
          .map(([key]) => [`byethrow/${key}`, 'error' as const]),
      ),
    },
  ],
});

export default oxlintByethrowPlugin;
