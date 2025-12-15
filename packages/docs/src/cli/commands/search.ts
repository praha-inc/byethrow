import path from 'node:path';
import url from 'node:url';

import { defineCommand } from 'citty';

import { createDocument, indexingDocuments, readIndexManifest } from '../..';

const __filename = url.fileURLToPath(import.meta.url);
const indexPath = path.join(__filename, '../../../../.index');

export const searchCommand = defineCommand({
  meta: {
    name: 'search',
    description: 'Search documentation',
  },
  args: {
    query: {
      type: 'positional',
      description: 'Search query',
    },
    limit: {
      type: 'string',
      alias: 'l',
      description: 'Limit number of results',
      default: '5',
    },
  },
  run: async ({ args }) => {
    const document = await createDocument(indexPath);
    const manifest = readIndexManifest(indexPath);
    if (manifest?.version !== BYETHROW_DOCS_VERSION) {
      await indexingDocuments(document);
    }

    const [result] = await document.searchAsync({
      enrich: true,
      highlight: {
        template: '<em>$1</em>',
        boundary: 128,
      },
      query: args.query,
      limit: Number(args.limit),
    });

    console.log(JSON.stringify({
      hits: (result?.result ?? []).map((result) => ({
        path: result.id,
        highlight: result.highlight,
      })),
    }, null, 2));
  },
});
