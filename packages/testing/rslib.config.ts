import { defineConfig } from '@rslib/core';

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
        '!**/*.test-d.*',
      ],
    },
    tsconfigPath: './tsconfig.build.json',
  },
  lib: [
    createLibrary('cjs'),
    createLibrary('esm'),
  ],
});
