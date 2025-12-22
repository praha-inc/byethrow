import { listDocuments } from './list-documents';
import { createDocument } from '../internals/create-document';
import { indexingDocuments } from '../internals/indexing-documents';
import { readIndexManifest } from '../internals/read-index-manifest';

export type SearchDocumentsOptions = {
  query: string;
  limit: number;
};

export type SearchDocumentsResult = {
  hits: {
    path: string;
    highlight: string;
    description: string;
  }[];
};

export const searchDocuments = async (options: SearchDocumentsOptions): Promise<SearchDocumentsResult> => {
  const document = await createDocument();

  const manifest = await readIndexManifest();
  if (manifest?.version !== BYETHROW_DOCS_VERSION) {
    await indexingDocuments(document);
  }

  const documents = await listDocuments().then(({ sections }) => {
    return sections.flatMap((section) => section.documents);
  });

  const [result] = await document.searchAsync({
    enrich: true,
    highlight: {
      template: '<em>$1</em>',
      boundary: 128,
    },
    query: options.query,
    limit: options.limit,
  });

  return {
    hits: (result?.result ?? []).map((result) => ({
      path: result.id.toString(),
      highlight: result.highlight!,
      description: documents.find((document) => document.path === result.id.toString())!.description,
    })),
  };
};
