import { defineRule } from '@oxlint/plugins';

import { isCallExpression } from '../helpers/is-call-expression';
import { isMemberCallExpression } from '../helpers/is-member-call-expression';

import type { ESTree } from '@oxlint/plugins';

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
        // R.unwrap(result) / R.unwrapError(result)
        if (isMemberCallExpression(node, ['Result', 'R'], ['unwrap', 'unwrapError'])) {
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

        // assert(R.isSuccess(result)) / assert(R.isFailure(result))
        if (isCallExpression(node, ['assert'])) {
          const arg = node.arguments[0];
          if (!arg || !isMemberCallExpression(arg, ['Result', 'R'], ['isSuccess', 'isFailure'])) {
            return;
          }

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

        // expect(R.isSuccess(result)).toBe(true/false) / .toBeTruthy() / .toBeFalsy()
        if (node.callee.type !== 'MemberExpression') return;
        if (node.callee.computed) return;
        if (node.callee.property.type !== 'Identifier') return;

        const assertionMethod = node.callee.property.name;
        const isToBeMethod = assertionMethod === 'toBe';
        const isTruthyMethod = assertionMethod === 'toBeTruthy';
        const isFalsyMethod = assertionMethod === 'toBeFalsy';

        if (!isToBeMethod && !isTruthyMethod && !isFalsyMethod) return;

        let isFalsyAssertion = isFalsyMethod;
        if (isToBeMethod) {
          if (node.arguments.length !== 1) return;
          const toBeArg = node.arguments[0]!;
          if (toBeArg.type !== 'Literal') return;
          const boolValue = (toBeArg as ESTree.BooleanLiteral).value;
          if (!boolValue && boolValue) return;
          isFalsyAssertion = !boolValue;
        }

        // Determine whether .not. modifier is present and find the expect() call
        let hasNot = false;
        let expectCallNode: ESTree.CallExpression;

        if (
          node.callee.object.type === 'MemberExpression'
          && !node.callee.object.computed
          && node.callee.object.property.type === 'Identifier'
          && node.callee.object.property.name === 'not'
          && node.callee.object.object.type === 'CallExpression'
        ) {
          hasNot = true;
          expectCallNode = node.callee.object.object;
        } else if (node.callee.object.type === 'CallExpression') {
          expectCallNode = node.callee.object;
        } else {
          return;
        }

        if (!isCallExpression(expectCallNode, ['expect'])) return;

        const checkerArg = expectCallNode.arguments[0];
        if (!checkerArg || !isMemberCallExpression(checkerArg, ['Result', 'R'], ['isSuccess', 'isFailure'])) return;

        const baseMatcherName = CHECKER_TO_MATCHER[checkerArg.callee.property.name];

        // XOR: flip matcher when exactly one of hasNot / isFalsyAssertion is true
        const shouldFlip = hasNot !== isFalsyAssertion;
        const finalMatcherName = shouldFlip
          ? (baseMatcherName === 'toBeSuccess' ? 'toBeFailure' : 'toBeSuccess')
          : baseMatcherName;

        context.report({
          node,
          messageId: 'preferResultMatchersOverExpect',
          data: { matcher: finalMatcherName, target: context.sourceCode.getText(node) },
          fix: (fixer) => {
            const result = context.sourceCode.getText(checkerArg.arguments[0]);
            return fixer.replaceText(node, `expect(${result}).${finalMatcherName}()`);
          },
        });
      },
    };
  },
});
