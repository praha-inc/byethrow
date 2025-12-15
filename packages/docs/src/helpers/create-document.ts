import fs from 'node:fs';
import path from 'node:path';

import { Document } from 'flexsearch';
import Database from 'flexsearch/db/sqlite';

import type { DocumentData } from 'flexsearch';

export const createDocument = async (storagePath: string): Promise<Document<DocumentData, false, Database>> => {
  if (!fs.existsSync(storagePath)) {
    fs.mkdirSync(storagePath);
  }

  const document = new Document<DocumentData, false, Database>({
    tokenize: 'full',
    document: {
      id: 'id',
      store: true,
      index: 'content',
    },
  });
  const database = new Database('storage', {
    // @ts-expect-error The type definitions for 'flexsearch' do not include the 'path' option for Database, but it is supported in the actual implementation.
    path: path.join(storagePath, 'databae.sqlite'),
  });
  await document.mount(database);
  return document;
};
