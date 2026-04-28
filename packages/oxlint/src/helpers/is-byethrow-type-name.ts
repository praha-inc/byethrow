import type { ESTree } from '@oxlint/plugins';

const BYETHROW_NAMESPACES = new Set(['Result', 'R']);

export const isByethrowTypeName = <T extends string>(
  node: ESTree.TSType,
  name?: T,
): node is ESTree.TSTypeReference & {
  typeName: {
    type: 'TSQualifiedName';
    left: {
      type: 'Identifier';
      name: 'Result' | 'R';
    };
    right: {
      name: T;
    };
  };
} => {
  if (
    node.type === 'TSTypeReference'
    && node.typeName.type === 'TSQualifiedName'
    && node.typeName.left.type === 'Identifier'
  ) {
    return (
      BYETHROW_NAMESPACES.has(node.typeName.left.name)
      && (!name || node.typeName.right.name === name)
    );
  }
  return false;
};
