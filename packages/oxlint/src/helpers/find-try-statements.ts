import { traverseFunctionBody } from './traverse-function-body';

import type { ESTree } from '@oxlint/plugins';

export const findTryStatements = (
  body: ESTree.FunctionBody | ESTree.Expression,
): ESTree.TryStatement[] => {
  const result: ESTree.TryStatement[] = [];
  traverseFunctionBody(body, (node) => {
    if (node.type === 'TryStatement') result.push(node);
  });
  return result;
};
