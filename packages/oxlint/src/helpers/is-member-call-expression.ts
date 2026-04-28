import type { ESTree } from '@oxlint/plugins';

export const isMemberCallExpression = <
  Module extends string,
  Callee extends string,
>(
  node: ESTree.Node,
  module: Module[],
  callee?: Callee[],
): node is ESTree.CallExpression & {
  callee: ESTree.StaticMemberExpression & {
    object: ESTree.IdentifierReference & {
      name: Module;
    };
    property: ESTree.IdentifierName & {
      name: Callee;
    };
  };
} => {
  return (
    node.type === 'CallExpression'
    && node.callee.type === 'MemberExpression'
    && !node.callee.computed
    && node.callee.property.type === 'Identifier'
    && node.callee.object.type === 'Identifier'
    && (module as string[]).includes(node.callee.object.name)
    && (!callee || (callee as string[]).includes(node.callee.property.name))
  );
};
