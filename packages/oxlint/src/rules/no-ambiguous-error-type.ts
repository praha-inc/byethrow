import { defineRule } from '@oxlint/plugins';

import { getByethrowSettings } from '../helpers/get-byethrow-settings';
import { getImportSource } from '../helpers/get-import-source';
import { hasTypeArguments } from '../helpers/has-type-arguments';
import { isByethrowTypeName } from '../helpers/is-byethrow-type-name';

import type { ESTree } from '@oxlint/plugins';

const AMBIGUOUS_ERROR_TYPES = new Set<ESTree.TSType['type']>([
  'TSUnknownKeyword',
  'TSAnyKeyword',
  'TSStringKeyword',
  'TSNumberKeyword',
  'TSBooleanKeyword',
  'TSBigIntKeyword',
  'TSSymbolKeyword',
  'TSObjectKeyword',
  'TSNullKeyword',
  'TSUndefinedKeyword',
]);

export const noAmbiguousErrorType = defineRule({
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow non-specific error types (primitives, `unknown`, `any`, `Error`, `object`, `{}`) in Result types',
      recommended: true,
    },
    messages: {
      noAmbiguousErrorType: 'Specify a concrete error type instead of `{{ type }}` in `{{ result }}`.',
    },
  },
  createOnce: (context) => {
    return {
      TSTypeReference: (node) => {
        const settings = getByethrowSettings(context);

        if (!isByethrowTypeName(node, settings.namespace, ['Result', 'ResultAsync', 'ResultMaybeAsync'])) return;
        if (!hasTypeArguments(node, 2)) return;

        const importSource = getImportSource(context.sourceCode.getScope(node), node.typeName.left);
        if (!importSource || !settings.module.includes(importSource)) return;

        const errorNode = node.typeArguments.params[1];
        if (errorNode.type === 'TSTypeLiteral') {
          if (0 < errorNode.members.length) return;
        } else if (errorNode.type === 'TSTypeReference') {
          if (errorNode.typeName.type !== 'Identifier' || errorNode.typeName.name !== 'Error') return;
        } else if (!AMBIGUOUS_ERROR_TYPES.has(errorNode.type)) {
          return;
        }

        context.report({
          node: errorNode,
          messageId: 'noAmbiguousErrorType',
          data: {
            type: context.sourceCode.getText(errorNode),
            result: context.sourceCode.getText(node),
          },
        });
      },
    };
  },
});
