import type { ESTree } from '@oxlint/plugins';

type Visitor = (node: ESTree.Statement) => void;

const traverseNode = (node: ESTree.Statement, visitor: Visitor): void => {
  if (node.type === 'FunctionDeclaration') return;

  visitor(node);

  if (node.type === 'TryStatement') {
    traverseStatements(node.block.body, visitor);
    if (node.handler) traverseStatements(node.handler.body.body, visitor);
    if (node.finalizer) traverseStatements(node.finalizer.body, visitor);
    return;
  }

  if (node.type === 'BlockStatement') {
    traverseStatements(node.body, visitor);
    return;
  }

  if (node.type === 'IfStatement') {
    traverseNode(node.consequent, visitor);
    if (node.alternate) traverseNode(node.alternate, visitor);
    return;
  }

  if (
    node.type === 'ForStatement'
    || node.type === 'ForInStatement'
    || node.type === 'ForOfStatement'
    || node.type === 'WhileStatement'
    || node.type === 'DoWhileStatement'
  ) {
    traverseNode((node as { body: ESTree.Statement }).body, visitor);
    return;
  }

  if (node.type === 'LabeledStatement') {
    traverseNode(node.body, visitor);
    return;
  }

  if (node.type === 'SwitchStatement') {
    for (const switchCase of node.cases) {
      traverseStatements(switchCase.consequent, visitor);
    }
    return;
  }

  if (node.type === 'WithStatement') {
    traverseNode(node.body, visitor);
  }
};

const traverseStatements = (
  statements: ReadonlyArray<ESTree.Directive | ESTree.Statement>,
  visitor: Visitor,
): void => {
  for (const node of statements) {
    traverseNode(node as ESTree.Statement, visitor);
  }
};

export const traverseFunctionBody = (
  body: ESTree.FunctionBody | ESTree.Expression,
  visitor: Visitor,
): void => {
  if (body.type !== 'BlockStatement') return;
  traverseStatements(body.body, visitor);
};
