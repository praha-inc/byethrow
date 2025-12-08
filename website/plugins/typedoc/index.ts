import fs from 'node:fs';
import path from 'node:path';

import { Application, DeclarationReflection } from 'typedoc';
import { load as pluginFrontmatter } from 'typedoc-plugin-frontmatter';
import { load as pluginMarkdown, MarkdownPageEvent } from 'typedoc-plugin-markdown';

import type { RspressPlugin } from '@rspress/core';
import type { Reflection } from 'typedoc';
import type { MarkdownTheme } from 'typedoc-plugin-markdown';

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
    plugin: [pluginFrontmatter, pluginMarkdown, pluginDescription],
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

export const pluginTypedoc = (): RspressPlugin => {
  return {
    name: '@praha/typedoc',
    config: async (config) => {
      const apiDirectory = path.join(config.root!, 'api');
      await createApiDocument(apiDirectory);
      await createMetaJson(apiDirectory);
      return config;
    },
  };
};
