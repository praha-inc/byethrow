import { defineRule } from '@oxlint/plugins';

import { getTypeNamePrefix } from '../helpers/get-type-name-prefix';
import { hasTypeArguments } from '../helpers/has-type-arguments';
import { isByethrowTypeName } from '../helpers/is-byethrow-type-name';
import { isIdentifierTypeName } from '../helpers/is-identifier-type-name';

export const preferResultAsync = defineRule({
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Prefer `ResultAsync<T, E>` over `Promise<Result<T, E>>`',
      recommended: true,
    },
    messages: {
      preferResultAsync: 'Use `ResultAsync<T, E>` instead of `Promise<Result<T, E>>`.',
    },
    fixable: 'code',
  },
  createOnce: (context) => {
    return {
      TSTypeReference: (node) => {
        if (!isIdentifierTypeName(node, 'Promise')) return;
        if (!hasTypeArguments(node, 1)) return;

        const innerType = node.typeArguments.params[0];
        if (!isByethrowTypeName(innerType, 'Result')) return;
        if (!hasTypeArguments(innerType, 2)) return;

        context.report({
          node,
          messageId: 'preferResultAsync',
          fix: (fixer) => {
            const typeNamePrefix = getTypeNamePrefix(innerType.typeName);
            const typeParameter1 = context.sourceCode.getText(innerType.typeArguments.params[0]);
            const typeParameter2 = context.sourceCode.getText(innerType.typeArguments.params[1]);

            return fixer.replaceText(
              node,
              `${typeNamePrefix}ResultAsync<${typeParameter1}, ${typeParameter2}>`,
            );
          },
        });
      },
    };
  },
});
