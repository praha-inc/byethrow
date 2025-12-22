import fs from 'node:fs';
import path from 'node:path';

import { indexPath } from '../constants/path';

import type { IndexManifest } from '../types/index-manifest';

export const readIndexManifest = async (): Promise<IndexManifest | undefined> => {
  const manifestPath = path.join(indexPath, 'manifest.json');
  if (!fs.existsSync(manifestPath)) return;

  const content = await fs.promises.readFile(manifestPath, { encoding: 'utf8' });
  return JSON.parse(content) as IndexManifest;
};
