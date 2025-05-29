import { defineConfig } from '@rslib/core';

export default defineConfig({
  source: {
    entry: {
      index: [
        './src/**',
        '!**/*.test.*',
      ],
    },
    tsconfigPath: './tsconfig.build.json',
  },
  lib: [
    {
      format: 'cjs',
      bundle: false,
      dts: true,
      output: {
        distPath: {
          root: './dist/cjs',
        },
      },
    },
    {
      format: 'esm',
      bundle: false,
      dts: true,
      output: {
        distPath: {
          root: './dist/esm',
        },
      },
    },
  ],
});
