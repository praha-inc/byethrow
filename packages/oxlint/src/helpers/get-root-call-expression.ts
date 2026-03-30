import type { ESTree } from '@oxlint/plugins';

export const getRootCallExpression = (node: ESTree.Node): ESTree.CallExpression | undefined => {
  if (node.type === 'CallExpression') {
    if (node.callee.type === 'MemberExpression') {
      return getRootCallExpression(node.callee.object);
    }
    return node;
  }
  if (node.type === 'MemberExpression') {
    return getRootCallExpression(node.object);
  }
  return undefined;
};
