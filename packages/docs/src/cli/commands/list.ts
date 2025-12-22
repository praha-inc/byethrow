import { defineCommand } from 'citty';

import { listDocuments } from '../..';

import type { ListDocumentsResult } from '../..';

export default defineCommand({
  meta: {
    name: 'list',
    description: 'List documentation',
  },
  args: {
    query: {
      type: 'string',
      description: 'Search query',
    },
  },
  run: async ({ args }) => {
    const result = await listDocuments();
    if (args.query) {
      const keywords = args.query.split(/\s+/).filter(Boolean);
      const filtered: ListDocumentsResult = { sections: [] };

      for (const section of result.sections) {
        const documents = section.documents.filter((document) => {
          const text = `${document.title} ${document.description}`.toLowerCase();
          return keywords.every((keyword) => text.includes(keyword));
        });

        if (0 < documents.length) {
          filtered.sections.push({
            ...section,
            documents: documents,
          });
        }
      }
      console.log(JSON.stringify(filtered, null, 2));
    } else {
      console.log(JSON.stringify(result, null, 2));
    }
  },
});
