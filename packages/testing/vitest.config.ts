import { defineConfig, mergeConfig } from 'vitest/config';

import config from '../../vitest.config';

export default mergeConfig(config, defineConfig({
  test: {
    typecheck: {
      enabled: true,
      tsconfig: 'tsconfig.build.json',
    },
  },
}));
