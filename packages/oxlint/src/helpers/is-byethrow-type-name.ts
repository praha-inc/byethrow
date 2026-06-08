import type { ESTree } from '@oxlint/plugins';

export const isByethrowTypeName = <Name extends string>(
  node: ESTree.TSType,
  namespaces: string[],
  name?: Name[],
): node is ESTree.TSTypeReference & {
  typeName: {
    type: 'TSQualifiedName';
    left: {
      type: 'Identifier';
      name: string;
    };
    right: {
      name: Name;
    };
  };
} => {
  if (
    node.type === 'TSTypeReference'
    && node.typeName.type === 'TSQualifiedName'
    && node.typeName.left.type === 'Identifier'
  ) {
    return (
      namespaces.includes(node.typeName.left.name)
      && (!name || (name as string[]).includes(node.typeName.right.name))
    );
  }
  return false;
};
