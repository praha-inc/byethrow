import { defineConfig } from '@rslib/core';

import packageJson from './package.json' with { type: 'json' };

import type { Format, LibConfig } from '@rslib/core';

const createLibrary = (format: Format): LibConfig => ({
  format,
  bundle: false,
  dts: true,
  redirect: {
    dts: {
      extension: true,
    },
  },
  output: {
    distPath: {
      root: `./dist/${format}`,
    },
  },
});

export default defineConfig({
  source: {
    entry: {
      index: [
        './src/**',
        '!**/*.test.*',
      ],
    },
    define: {
      BYETHROW_DOCS_VERSION: JSON.stringify(packageJson.version),
    },
    tsconfigPath: './tsconfig.build.json',
  },
  lib: [
    createLibrary('cjs'),
    createLibrary('esm'),
  ],
});
