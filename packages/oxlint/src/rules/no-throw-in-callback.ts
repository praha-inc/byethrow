import { defineRule } from '@oxlint/plugins';

import { findThrowStatements } from '../helpers/find-throw-statements';
import { isCallbackArgument } from '../helpers/is-callback-argument';
import { isMemberCallExpression } from '../helpers/is-member-call-expression';

import type { Context, ESTree } from '@oxlint/plugins';

export const noThrowInCallback = defineRule({
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow throw statements inside callbacks passed to byethrow functions',
      recommended: true,
    },
    messages: {
      noThrowInCallback: 'Avoid throw statements inside byethrow callbacks. Use Result.fail() to represent errors instead.',
    },
  },
  createOnce: (context) => {
    const reportIfNeeded = (
      context: Context,
      callback: ESTree.Function | ESTree.ArrowFunctionExpression,
    ): void => {
      const throwStatements = callback.body ? findThrowStatements(callback.body) : [];
      for (const throwStatement of throwStatements) {
        context.report({ node: throwStatement, messageId: 'noThrowInCallback' });
      }
    };

    return {
      CallExpression: (node) => {
        if (!isMemberCallExpression(node, ['Result', 'R'])) return;

        for (const argument of node.arguments) {
          if (isCallbackArgument(argument)) {
            reportIfNeeded(context, argument);
          } else if (argument.type === 'ObjectExpression') {
            for (const property of argument.properties) {
              if (property.type !== 'Property') continue;
              if (!isCallbackArgument(property.value)) continue;
              reportIfNeeded(context, property.value);
            }
          }
        }
      },
    };
  },
});
