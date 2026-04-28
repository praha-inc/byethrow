import type { ESTree } from '@oxlint/plugins';

export const isIdentifierTypeName = (
  node: ESTree.TSTypeReference,
  name?: string,
): node is ESTree.TSTypeReference & {
  typeName: {
    type: 'Identifier';
  };
} => {
  return node.typeName.type === 'Identifier' && (!name || node.typeName.name === name);
};
