import { defineRule } from '@oxlint/plugins';

import { getByethrowSettings } from '../helpers/get-byethrow-settings';
import { getImportSource } from '../helpers/get-import-source';
import { getTypeNamePrefix } from '../helpers/get-type-name-prefix';
import { hasTypeArguments } from '../helpers/has-type-arguments';
import { isByethrowTypeName } from '../helpers/is-byethrow-type-name';

export const preferResultMaybeAsync = defineRule({
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Prefer `ResultMaybeAsync<T, E>` over `Result<T, E> | ResultAsync<T, E>`',
      recommended: true,
    },
    messages: {
      preferResultMaybeAsync: 'Use `ResultMaybeAsync<T, E>` instead of `Result<T, E> | ResultAsync<T, E>`.',
    },
    fixable: 'code',
  },
  createOnce: (context) => {
    return {
      TSUnionType: (node) => {
        const settings = getByethrowSettings(context);

        const resultTypeNode = node.types.find((type) => {
          return isByethrowTypeName(type, settings.namespace, ['Result']) && hasTypeArguments(type, 2);
        });
        const resultAsyncTypeNode = node.types.find((type) => {
          return isByethrowTypeName(type, settings.namespace, ['ResultAsync']) && hasTypeArguments(type, 2);
        });

        if (!resultTypeNode || !resultAsyncTypeNode) return;

        const importSources = [
          getImportSource(context.sourceCode.getScope(node), resultTypeNode.typeName.left),
          getImportSource(context.sourceCode.getScope(node), resultAsyncTypeNode.typeName.left),
        ];
        if (importSources.some((source) => !source || !settings.module.includes(source))) {
          return;
        }

        const typeNamePrefix = getTypeNamePrefix(resultTypeNode.typeName);

        const resultT = context.sourceCode.getText(resultTypeNode.typeArguments.params[0]);
        const resultE = context.sourceCode.getText(resultTypeNode.typeArguments.params[1]);
        const resultAsyncT = context.sourceCode.getText(resultAsyncTypeNode.typeArguments.params[0]);
        const resultAsyncE = context.sourceCode.getText(resultAsyncTypeNode.typeArguments.params[1]);

        if (resultT !== resultAsyncT || resultE !== resultAsyncE) return;

        context.report({
          node,
          messageId: 'preferResultMaybeAsync',
          fix: (fixer) => {
            const types = node.types
              .map((type) => {
                if (type === resultTypeNode) return `${typeNamePrefix}ResultMaybeAsync<${resultT}, ${resultE}>`;
                if (type === resultAsyncTypeNode) return null;
                return context.sourceCode.getText(type);
              })
              .filter((type): type is string => type !== null);

            return fixer.replaceText(node, types.join(' | '));
          },
        });
      },
    };
  },
});
