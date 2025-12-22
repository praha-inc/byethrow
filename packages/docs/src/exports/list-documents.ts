import fs from 'node:fs/promises';
import path from 'node:path';

import { fromMarkdown } from 'mdast-util-from-markdown';

import { docsPath } from '../constants/path';

export type DocumentNode = {
  path: string;
  title: string;
  description: string;
};

export type DocumentSection = {
  name: string;
  documents: DocumentNode[];
};

export const listDocuments = async (): Promise<{ sections: DocumentSection[] }> => {
  const content = await fs.readFile(path.join(docsPath, 'index.md'), { encoding: 'utf8' });
  const mdast = fromMarkdown(content);

  const sections: DocumentSection[] = [];
  for (const [index, node] of mdast.children.entries()) {
    if (node.type !== 'heading') {
      continue;
    }

    const nextNode = mdast.children[index + 1];
    if (nextNode?.type !== 'list') {
      continue;
    }

    sections.push({
      name: node.children
        .filter((node) => node.type === 'text')
        .map((node) => node.value)
        .join(''),
      documents: nextNode.children
        .filter((listItem) => {
          if (listItem.children[0]?.type !== 'paragraph') return false;
          return listItem.children[0].children[0]?.type === 'link' && listItem.children[0].children[1]?.type === 'text';
        })
        .map((listItem) => {
          const paragraph = listItem.children.find((child) => child.type === 'paragraph')!;
          const link = paragraph.children.find((child) => child.type === 'link')!;
          const title = link.children.find((child) => child.type === 'text')!;
          const description = paragraph.children.find((child) => child.type === 'text')!;

          return {
            path: path.join(docsPath, link.url),
            title: title.value,
            description: description.value.replace(/^: /, ''),
          };
        }),
    });
  }

  return { sections };
};
