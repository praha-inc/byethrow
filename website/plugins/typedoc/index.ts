import fs from 'node:fs';
import path from 'node:path';

import { Application, Converter, DeclarationReflection, ReflectionKind } from 'typedoc';
import { load as pluginFrontmatter } from 'typedoc-plugin-frontmatter';
import { load as pluginMarkdown, MarkdownPageEvent } from 'typedoc-plugin-markdown';

import { FLOWS } from '../../theme/components/exports/result-flow/flows';

import type { RspressPlugin } from '@rspress/core';
import type { Reflection } from 'typedoc';
import type { MarkdownTheme } from 'typedoc-plugin-markdown';
import type ts from 'typescript';

/**
 * Overloaded functions are documented on their first overload signature so that the comment is kept in the emitted `.d.ts`.
 * TypeDoc copies that comment to every call signature, so it is attached to the function itself instead,
 * which prevents TypeDoc from repeating it for each signature.
 */
const pluginOverloadComment = (app: Application) => {
  app.converter.on(Converter.EVENT_CREATE_DECLARATION, (context, reflection) => {
    if (!reflection.kindOf(ReflectionKind.Function) || reflection.comment) return;

    const [declaration, ...overloads] = context.getSymbolFromReflection(reflection)?.declarations ?? [];
    if (!declaration || overloads.length <= 0) return;

    const comment = context.getSignatureComment(declaration as ts.SignatureDeclaration);
    if (comment) reflection.comment = comment;
  });
};

const pluginDescription = (app: Application) => {
  app.renderer.on(MarkdownPageEvent.BEGIN, (page) => {
    if (!(page.model instanceof DeclarationReflection)) return;

    const context = (app.renderer.theme as MarkdownTheme).getRenderContext(page as MarkdownPageEvent<Reflection>);
    const comment = page.model.comment || page.model.signatures?.[0]?.comment;
    if (comment) {
      // @ts-expect-error Typedoc does not recognize frontmatter property
      page['frontmatter'] = {
        description: context
          .helpers
          .getDescriptionForComment(comment)
          ?.replaceAll(/\[([^\]]+)]\([^)]+\)/g, '$1'),
      };
    }
  });
};

const createApiDocument = async (apiDirectory: string): Promise<void> => {
  const app = await Application.bootstrapWithPlugins({
    name: 'byethrow',
    entryPoints: ['../packages/byethrow/src/index.ts'],
    tsconfig: '../packages/byethrow/tsconfig.build.json',
    disableSources: true,
    router: 'kind',
    readme: 'none',
    indexFormat: 'table',
    githubPages: false,
    requiredToBeDocumented: ['Class', 'Function', 'Interface'],
    categoryOrder: [
      'Core Types',
      'Infer Types',
      'Creators',
      'Combinators',
      'Unwraps',
      'Assertions',
      'Type Guards',
      'Utilities',
      '*',
    ],
    // @ts-expect-error Typedoc does not export a type for this options
    plugin: [pluginFrontmatter, pluginMarkdown, pluginDescription, pluginOverloadComment],
    entryFileName: 'index',
    hidePageHeader: true,
    hideBreadcrumbs: true,
    pageTitleTemplates: {
      module: '{kind}: {name}', // e.g. "Module: MyModule"
    },
  });

  const project = await app.convert();
  if (project) {
    await app.outputs.writeOutput(
      { name: 'markdown', path: apiDirectory },
      project,
    );
  }
};

const createMetaJson = async (apiDirectory: string): Promise<void> => {
  const metaJsonPath = path.join(apiDirectory, '_meta.json');
  await fs.promises.writeFile(metaJsonPath, JSON.stringify([
    'index',
    {
      type: 'dir',
      name: 'modules',
      label: 'Modules',
    },
    {
      type: 'dir',
      name: 'types',
      label: 'Types',
    },
    {
      type: 'dir',
      name: 'functions',
      label: 'Functions',
    },
  ], null, 2));
};

/**
 * Shows the flow diagram of every function that has one, right below its description.
 * Plain `.md` pages cannot render components, so those pages are rewritten as `.mdx`;
 * links to them keep the `.md` extension, which Rspress resolves to the same route.
 */
const embedResultFlows = async (apiDirectory: string): Promise<void> => {
  await Promise.all(Object.keys(FLOWS).map(async (name) => {
    const markdownPath = path.join(apiDirectory, 'functions', `Result.${name}.md`);
    const content = await fs.promises.readFile(markdownPath, 'utf8');
    const frontmatterEnd = content.indexOf('\n---\n', 1) + '\n---\n'.length;
    const firstSection = content.indexOf('\n## ', frontmatterEnd);
    const theme = path.relative(path.dirname(markdownPath), path.join(import.meta.dirname, '../../theme'));

    await fs.promises.writeFile(markdownPath.replace(/\.md$/, '.mdx'), [
      content.slice(0, frontmatterEnd),
      `\nimport { ResultFlow } from '${theme}';\n`,
      content.slice(frontmatterEnd, firstSection),
      `\n<ResultFlow fn="${name}" />\n`,
      content.slice(firstSection),
    ].join(''));
    await fs.promises.rm(markdownPath);
  }));
};

export const pluginTypedoc = (): RspressPlugin => {
  return {
    name: '@praha/typedoc',
    config: async (config) => {
      await Promise.all(
        config.locales!.map(async (locale) => {
          const apiDirectory = path.join(config.root!, locale.lang, 'api');
          await createApiDocument(apiDirectory);
          await embedResultFlows(apiDirectory);
          await createMetaJson(apiDirectory);
        }),
      );
      return config;
    },
  };
};
