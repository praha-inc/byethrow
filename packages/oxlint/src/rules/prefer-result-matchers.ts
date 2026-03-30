import { defineRule } from '@oxlint/plugins';

import { getByethrowSettings } from '../helpers/get-byethrow-settings';
import { getImportSource } from '../helpers/get-import-source';
import { getRootCallExpression } from '../helpers/get-root-call-expression';
import { hasIdentifier } from '../helpers/has-identifier';
import { isCallExpression } from '../helpers/is-call-expression';
import { isModuleCallExpression } from '../helpers/is-module-call-expression';

const CHECKER_TO_MATCHER = {
  isSuccess: 'toBeSuccess',
  isFailure: 'toBeFailure',
} as const;

const CHECKER_TO_CALLBACK = {
  isSuccess: '(value) => {}',
  isFailure: '(error) => {}',
} as const;

const UNWRAP_TO_MATCHER = {
  unwrap: 'toBeSuccess',
  unwrapError: 'toBeFailure',
} as const;

const UNWRAP_TO_CALLBACK = {
  unwrap: '(value) => {}',
  unwrapError: '(error) => {}',
} as const;

export const preferResultMatchers = defineRule({
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Prefer `expect(result).toBeSuccess()` over `expect(Result.isSuccess(result)).toBe(true)`, `assert(Result.isSuccess(result))`, or `Result.unwrap(result)`',
      recommended: true,
      testing: true,
    },
    messages: {
      preferResultMatchersOverExpect: 'Use `expect(result).{{ matcher }}()` instead of `{{ target }}`.',
      preferResultMatchersOverAssert: 'Use `expect(result).{{ matcher }}()` instead of `{{ target }}`.',
      preferResultMatchersOverUnwrap: 'Use `expect(result).{{ matcher }}({{ callback }})` instead of `{{ target }}`.',
    },
    fixable: 'code',
  },
  createOnce: (context) => {
    return {
      CallExpression: (node) => {
        const settings = getByethrowSettings(context);

        // expect(R.isSuccess(result)) / expect(R.isFailure(result))
        if (node.callee.type === 'MemberExpression' && isCallExpression(node, ['toBe', 'toBeTruthy', 'toBeFalsy'])) {
          const callExpression = getRootCallExpression(node);
          if (!callExpression || !isCallExpression(callExpression, ['expect'])) {
            return;
          }

          const expectArg = callExpression.arguments[0];
          if (!expectArg || !isModuleCallExpression(expectArg, settings.namespace, ['isSuccess', 'isFailure'])) {
            return;
          }

          const importSource = getImportSource(context.sourceCode.getScope(node), expectArg.callee.object);
          if (!importSource || !settings.module.includes(importSource)) return;

          const isTruthyAssertion = (
            node.callee.property.name === 'toBeTruthy'
            || (!!node.arguments[0] && node.arguments[0].type === 'Literal' && !!node.arguments[0].value)
          );

          const shouldFlip = hasIdentifier(node.callee.object, 'not') === isTruthyAssertion;
          const checker = shouldFlip ? (expectArg.callee.property.name === 'isSuccess' ? 'isFailure' : 'isSuccess') : expectArg.callee.property.name;
          const matcher = CHECKER_TO_MATCHER[checker];

          context.report({
            node,
            messageId: 'preferResultMatchersOverExpect',
            data: { matcher, target: context.sourceCode.getText(node) },
            fix: (fixer) => {
              const result = context.sourceCode.getText(expectArg.arguments[0]);
              return fixer.replaceText(node, `expect(${result}).${matcher}()`);
            },
          });
          return;
        }

        // assert(R.isSuccess(result)) / assert(R.isFailure(result))
        if (isCallExpression(node, ['assert'])) {
          const arg = node.arguments[0];
          if (!arg || !isModuleCallExpression(arg, settings.namespace, ['isSuccess', 'isFailure'])) {
            return;
          }

          const importSource = getImportSource(context.sourceCode.getScope(node), arg.callee.object);
          if (!importSource || !settings.module.includes(importSource)) return;

          const matcher = CHECKER_TO_MATCHER[arg.callee.property.name];
          const callback = CHECKER_TO_CALLBACK[arg.callee.property.name];
          context.report({
            node,
            messageId: 'preferResultMatchersOverAssert',
            data: { matcher, target: context.sourceCode.getText(node) },
            fix: (fixer) => {
              const result = context.sourceCode.getText(arg.arguments[0]);
              return fixer.replaceText(node, `expect(${result}).${matcher}(${callback})`);
            },
          });
          return;
        }

        // R.unwrap(result) / R.unwrapError(result)
        if (isModuleCallExpression(node, settings.namespace, ['unwrap', 'unwrapError'])) {
          const importSource = getImportSource(context.sourceCode.getScope(node), node.callee.object);
          if (!importSource || !settings.module.includes(importSource)) return;

          const matcher = UNWRAP_TO_MATCHER[node.callee.property.name];
          const callback = UNWRAP_TO_CALLBACK[node.callee.property.name];
          context.report({
            node,
            messageId: 'preferResultMatchersOverUnwrap',
            data: { matcher, callback, target: context.sourceCode.getText(node) },
            fix: (fixer) => {
              const result = context.sourceCode.getText(node.arguments[0]);
              return fixer.replaceText(node, `expect(${result}).${matcher}(${callback})`);
            },
          });
          return;
        }
      },
    };
  },
});
