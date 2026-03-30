import { defineRule } from '@oxlint/plugins';

import { getByethrowSettings } from '../helpers/get-byethrow-settings';

export const consistentNamespace = defineRule({
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Enforce consistent namespace (`Result` or `R`) when importing from byethrow',
      recommended: true,
    },
    messages: {
      consistentNamespace: 'Use `{{ preferred }}` instead of `{{ actual }}` as the byethrow namespace.',
    },
    fixable: 'code',
    schema: [
      {
        type: 'string',
      },
    ],
    defaultOptions: ['Result'],
  },
  createOnce: (context) => {
    return {
      ImportDeclaration: (node) => {
        const settings = getByethrowSettings(context);
        if (!settings.module.includes(node.source.value)) return;

        const preferredNamespace = context.options[0] as string;
        for (const specifier of node.specifiers) {
          if (specifier.type !== 'ImportSpecifier') continue;

          const importedName = specifier.imported.type === 'Identifier'
            ? specifier.imported.name
            : specifier.imported.value;

          if (!settings.namespace.includes(importedName)) continue;
          if (specifier.local.name === preferredNamespace) continue;

          context.report({
            node: specifier,
            messageId: 'consistentNamespace',
            data: {
              preferred: preferredNamespace,
              actual: specifier.local.name,
            },
            fix: (fixer) => {
              const scope = context.sourceCode.getScope(node);
              const variable = scope.set.get(specifier.local.name);

              const specifierIndex = node.specifiers.indexOf(specifier);
              const preferredAlreadyImported = node.specifiers.some((s, index) => {
                return index !== specifierIndex && s.type === 'ImportSpecifier' && s.local.name === preferredNamespace;
              });

              const importFix = preferredAlreadyImported
                ? (specifierIndex === 0
                    ? fixer.removeRange([specifier.range[0], node.specifiers[1]!.range[0]])
                    : fixer.removeRange([node.specifiers[specifierIndex - 1]!.range[1], specifier.range[1]]))
                : fixer.replaceText(specifier, preferredNamespace);

              const referenceFixes = variable?.references.map((ref) => fixer.replaceText(ref.identifier, preferredNamespace)) ?? [];

              return [importFix, ...referenceFixes];
            },
          });
        }
      },
    };
  },
});
