import fs from 'node:fs';
import path from 'node:path';

import type { IndexManifest } from '../types/index-manifest';

export const readIndexManifest = (storagePath: string): IndexManifest | undefined => {
  const manifestPath = path.join(storagePath, 'manifest.json');
  if (!fs.existsSync(manifestPath)) return;

  const content = fs.readFileSync(manifestPath, { encoding: 'utf8' });
  return JSON.parse(content) as IndexManifest;
};
