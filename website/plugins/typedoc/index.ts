import fs from 'node:fs';
import path from 'node:path';

import { execa } from 'execa';

import type { RspressPlugin } from '@rspress/core';

const cleanDirectory = async (directory: string): Promise<void> => {
  if (fs.existsSync(directory)) {
    await fs.promises.rmdir(directory);
  }
};

const createApiDocument = async (apiDirectory: string): Promise<void> => {
  await execa('pnpm', ['--filter', '@praha/byethrow', 'build:doc']);
  await fs.promises.rename(
    path.resolve(process.cwd(), '../packages/byethrow/docs'),
    apiDirectory,
  );
};

const readmeToIndex = async (apiDirectory: string): Promise<void> => {
  await fs.promises.rename(
    path.join(apiDirectory, 'README.md'),
    path.join(apiDirectory, 'index.md'),
  );
};

const createMetaJson = async (apiDirectory: string): Promise<void> => {
  const metaJsonPath = path.join(apiDirectory, '_meta.json');
  await fs.promises.writeFile(metaJsonPath, JSON.stringify([
    'index',
    {
      type: 'dir',
      name: 'modules',
      label: 'Modules',
    },
    {
      type: 'dir',
      name: 'types',
      label: 'Types',
    },
    {
      type: 'dir',
      name: 'functions',
      label: 'Functions',
    },
  ], null, 2));
};

export const pluginTypedoc = (): RspressPlugin => {
  return {
    name: '@praha/typedoc',
    config: async (config) => {
      const apiDirectory = path.join(config.root!, 'api');
      await cleanDirectory(apiDirectory);
      await createApiDocument(apiDirectory);
      await readmeToIndex(apiDirectory);
      await createMetaJson(apiDirectory);
      return config;
    },
  };
};
