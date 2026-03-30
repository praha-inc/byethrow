import type { ESTree } from '@oxlint/plugins';

type Tuple<T, N extends number, R extends T[] = []>
  = R['length'] extends N ? R : Tuple<T, N, [...R, T]>;

export const hasTypeArguments = <N extends number>(
  node: ESTree.Node,
  count: N,
): node is ESTree.Node & {
  typeArguments: {
    params: Tuple<ESTree.TSType, N>;
  };
} => {
  return (
    'typeArguments' in node
    && node.typeArguments != null
    && node.typeArguments.params.length === count
  );
};
