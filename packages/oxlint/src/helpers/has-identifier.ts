import type { ESTree } from '@oxlint/plugins';

export const hasIdentifier = (
  node: ESTree.Node,
  name: string,
): boolean => {
  if (node.type === 'Identifier' && node.name === name) {
    return true;
  }

  if (node.type === 'MemberExpression') {
    return hasIdentifier(node.object, name) || hasIdentifier(node.property, name);
  }

  return false;
};
