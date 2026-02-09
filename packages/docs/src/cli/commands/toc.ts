import path from 'node:path';

import { defineCommand } from 'citty';

import { extractToc } from '../..';
import { docsPath } from '../../constants/path';

export default defineCommand({
  meta: {
    name: 'toc',
    description: 'Display table of contents',
  },
  args: {
    path: {
      type: 'positional',
      required: true,
      description: 'Path to the documentation',
    },
  },
  run: async ({ args }) => {
    const documentPath = args.path.startsWith(docsPath) ? args.path : path.join(process.cwd(), args.path);
    const result = await extractToc(documentPath);
    console.log(JSON.stringify(result, null, 2));
  },
});
