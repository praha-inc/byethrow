import { defineRule } from '@oxlint/plugins';

import { findTryStatements } from '../helpers/find-try-statements';
import { isCallbackArgument } from '../helpers/is-callback-argument';
import { isMemberCallExpression } from '../helpers/is-member-call-expression';

import type { Context, ESTree } from '@oxlint/plugins';

export const noTryCatchInCallback = defineRule({
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow try-catch inside callbacks passed to byethrow functions',
      recommended: true,
    },
    messages: {
      noTryCatchInCallback: 'Avoid try-catch inside byethrow callbacks. Use Result.fn() to wrap throwing code instead.',
    },
  },
  createOnce: (context) => {
    const reportIfNeeded = (
      context: Context,
      callback: ESTree.Function | ESTree.ArrowFunctionExpression,
    ): void => {
      const tryStatements = callback.body ? findTryStatements(callback.body) : [];
      for (const tryStatement of tryStatements) {
        if (!tryStatement.handler) continue;
        context.report({ node: tryStatement, messageId: 'noTryCatchInCallback' });
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
