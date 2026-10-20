import { defineConfig } from 'oxlint';

import config from '../../oxlint.config.ts';

export default defineConfig({
  extends: [
    config,
  ],
  overrides: [
    {
      // Public API functions are declared with `function` so that IDEs treat them as functions (e.g. inserting parentheses on completion)
      files: ['src/functions/**'],
      rules: {
        'eslint/func-style': ['error', 'declaration', {
          allowArrowFunctions: true,
        }],
      },
    },
  ],
});
