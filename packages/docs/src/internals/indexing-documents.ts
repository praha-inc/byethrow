import fs from 'node:fs/promises';
import path from 'node:path';

import { docsPath, indexPath } from '../constants/path';

import type { IndexManifest } from '../types/index-manifest';
import type { Document, DocumentData } from 'flexsearch';
import type Database from 'flexsearch/db/sqlite';

type DocumentEntry = {
  path: string;
  content: string;
};

const readDocument = async (filePath: string): Promise<DocumentEntry> => {
  return {
    path: filePath,
    content: await fs.readFile(filePath, { encoding: 'utf8' }),
  };
};

const readDocuments = async (directory: string): Promise<DocumentEntry[]> => {
  const documents: DocumentEntry[] = [];
  for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      documents.push(...await readDocuments(fullPath));
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      documents.push(await readDocument(fullPath));
    }
  }
  return documents;
};

export const indexingDocuments = async (document: Document<DocumentData, false, Database>) => {
  await document.clear();

  for (const _document of await readDocuments(docsPath)) {
    if (_document.path.endsWith('/index.md')) continue;
    document.add({ id: _document.path, content: _document.content });
  }

  await document.commit();
  await fs.writeFile(path.join(indexPath, 'manifest.json'), JSON.stringify({
    version: BYETHROW_DOCS_VERSION,
  } satisfies IndexManifest),
  );
};
