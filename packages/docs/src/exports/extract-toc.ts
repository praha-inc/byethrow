import fs from 'node:fs/promises';

import { fromMarkdown } from 'mdast-util-from-markdown';
import { toString } from 'mdast-util-to-string';

import { docsPath } from '../constants/path';

export type Header = {
  title: string;
  depth: number;
};

export type ExtractTocResult = {
  headers: Header[];
};

export const extractToc = async (documentPath: string): Promise<ExtractTocResult> => {
  if (!documentPath.startsWith(docsPath)) {
    throw new Error(`The path must start with '${docsPath}'.`);
  }

  const content = await fs.readFile(documentPath, { encoding: 'utf8' });
  const mdast = fromMarkdown(content);

  const headers: Header[] = [];
  for (const node of mdast.children) {
    if (node.type === 'heading') {
      const title = node.children.filter((child) => child.type === 'text');

      headers.push({
        title: toString(title),
        depth: node.depth,
      });
    }
  }

  return { headers };
};
