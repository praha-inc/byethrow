import type { ESTree } from '@oxlint/plugins';

export const isCallbackArgument = (
  node: ESTree.Argument,
): node is ESTree.Function | ESTree.ArrowFunctionExpression => {
  return (
    node.type === 'FunctionExpression'
    || node.type === 'ArrowFunctionExpression'
  );
};
