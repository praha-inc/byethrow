import path from 'node:path';
import url from 'node:url';

const __filename = url.fileURLToPath(import.meta.url);

export const distPath = path.join(__filename, '../../..');

export const indexPath = path.join(distPath, '.index');

export const docsPath = path.join(__filename, '../../../../docs');
