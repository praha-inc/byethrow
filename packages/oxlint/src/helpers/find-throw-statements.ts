import { traverseFunctionBody } from './traverse-function-body';

import type { ESTree } from '@oxlint/plugins';

export const findThrowStatements = (
  body: ESTree.FunctionBody | ESTree.Expression,
): ESTree.ThrowStatement[] => {
  const result: ESTree.ThrowStatement[] = [];
  traverseFunctionBody(body, (node) => {
    if (node.type === 'ThrowStatement') result.push(node);
  });
  return result;
};
