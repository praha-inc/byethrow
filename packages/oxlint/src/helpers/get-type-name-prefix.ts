import type { ESTree } from '@oxlint/plugins';

export const getTypeNamePrefix = (typeName: ESTree.TSTypeName): string | undefined => {
  if (typeName.type === 'TSQualifiedName' && typeName.left.type === 'Identifier') {
    return `${typeName.left.name}.`;
  }
  return;
};
