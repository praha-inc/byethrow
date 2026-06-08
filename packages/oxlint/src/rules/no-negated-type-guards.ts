import { defineRule } from '@oxlint/plugins';

import { getByethrowSettings } from '../helpers/get-byethrow-settings';
import { getImportSource } from '../helpers/get-import-source';
import { isModuleCallExpression } from '../helpers/is-module-call-expression';

const NEGATION_TO_REPLACEMENT = {
  isSuccess: 'isFailure',
  isFailure: 'isSuccess',
} as const;

export const noNegatedTypeGuards = defineRule({
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow using the negation operator on `Result.isSuccess()` or `Result.isFailure()`',
      recommended: true,
    },
    messages: {
      noNegatedTypeGuards: 'Use `{{ replacement }}` instead of `{{ target }}`.',
    },
    fixable: 'code',
  },
  createOnce: (context) => {
    return {
      UnaryExpression: (node) => {
        if (node.operator !== '!') return;

        const settings = getByethrowSettings(context);
        if (!isModuleCallExpression(node.argument, settings.namespace, ['isSuccess', 'isFailure'])) return;

        const importSource = getImportSource(context.sourceCode.getScope(node), node.argument.callee.object);
        if (!importSource || !settings.module.includes(importSource)) return;

        const replacement = NEGATION_TO_REPLACEMENT[node.argument.callee.property.name];
        const module = node.argument.callee.object.name;
        const firstArg = node.argument.arguments[0];
        const args = firstArg ? context.sourceCode.getText(firstArg) : '';

        context.report({
          node,
          messageId: 'noNegatedTypeGuards',
          data: {
            replacement: `${module}.${replacement}(${args})`,
            target: context.sourceCode.getText(node),
          },
          fix: (fixer) => {
            return fixer.replaceText(node, `${module}.${replacement}(${args})`);
          },
        });
      },
    };
  },
});
