import { defineCommand } from 'citty';

import { searchDocuments } from '../..';

export default defineCommand({
  meta: {
    name: 'search',
    description: 'Search documentation',
  },
  args: {
    query: {
      type: 'positional',
      required: true,
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
    const result = await searchDocuments({
      query: args.query,
      limit: Number(args.limit),
    });
    console.log(JSON.stringify(result, null, 2));
  },
});
