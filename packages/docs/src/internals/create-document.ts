import fs from 'node:fs';
import path from 'node:path';

import { Document } from 'flexsearch';
import Database from 'flexsearch/db/sqlite';

import { indexPath } from '../constants/path';

import type { DocumentData } from 'flexsearch';

let instance: Document<DocumentData, false, Database> | null = null;

export const createDocument = async (): Promise<Document<DocumentData, false, Database>> => {
  if (instance) return instance;
  if (!fs.existsSync(indexPath)) fs.mkdirSync(indexPath);

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
    path: path.join(indexPath, 'databae.sqlite'),
  });

  await document.mount(database);

  instance = document;
  return document;
};
