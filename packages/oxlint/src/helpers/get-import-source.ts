import type { ESTree, Scope } from '@oxlint/plugins';

export const getImportSource = (scope: Scope, target: ESTree.Node): string | undefined => {
  const variable = scope.references.find((ref) => ref.identifier === target)?.resolved;
  const node = variable?.defs[0]?.parent;
  if (node?.type !== 'ImportDeclaration') return;
  return node.source.value;
};
