import type { ESTree } from '@oxlint/plugins';

export const isCallExpression = <Callee extends string>(
  node: ESTree.Node,
  callee: Callee[],
): node is ESTree.CallExpression & {
  callee: ESTree.IdentifierReference & {
    name: Callee;
  };
} => {
  return (
    node.type === 'CallExpression'
    && node.callee.type === 'Identifier'
    && (callee as string[]).includes(node.callee.name)
  );
};
