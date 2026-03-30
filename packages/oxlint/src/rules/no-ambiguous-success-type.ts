import { defineRule } from '@oxlint/plugins';

import { getByethrowSettings } from '../helpers/get-byethrow-settings';
import { getImportSource } from '../helpers/get-import-source';
import { hasTypeArguments } from '../helpers/has-type-arguments';
import { isByethrowTypeName } from '../helpers/is-byethrow-type-name';

import type { ESTree } from '@oxlint/plugins';

const AMBIGUOUS_SUCCESS_TYPES = new Set<ESTree.TSType['type']>([
  'TSUnknownKeyword',
  'TSAnyKeyword',
  'TSObjectKeyword',
]);

export const noAmbiguousSuccessType = defineRule({
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow non-specific success types (`unknown`, `any`, `object`, `{}`) in Result types',
      recommended: true,
    },
    messages: {
      noAmbiguousSuccessType: 'Specify a concrete success type instead of `{{ type }}` in `{{ result }}`.',
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

        const successNode = node.typeArguments.params[0];
        if (successNode.type === 'TSTypeLiteral') {
          if (0 < successNode.members.length) return;
        } else if (!AMBIGUOUS_SUCCESS_TYPES.has(successNode.type)) {
          return;
        }

        context.report({
          node: successNode,
          messageId: 'noAmbiguousSuccessType',
          data: {
            type: context.sourceCode.getText(successNode),
            result: context.sourceCode.getText(node),
          },
        });
      },
    };
  },
});
