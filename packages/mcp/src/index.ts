#!/usr/bin/env node

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { defineCommand, runMain } from 'citty';
import { createConsola } from 'consola';
import { z } from 'zod';

import packageJson from '../package.json';

const main = defineCommand({
  meta: {
    name: '@praha/byethrowｰmcp',
    version: packageJson.version,
    description: 'MCP Server for @praha/byethrow',
  },
  args: {
    verbose: {
      type: 'boolean',
      alias: 'v',
      description: 'Enable verbose logging',
    },
  },
  run: async ({ args }) => {
    const consola = createConsola({ level: args.verbose ? 3 : 0 });

    consola.info('Starting MCP server...');
    const server = new McpServer(
      {
        name: '@praha/byethrow',
        version: packageJson.version,
      },
      {
        instructions: 'Use this server to retrieve up-to-date documentation and code examples for @praha/byethrow.',
      },
    );

    const loadDocument = (key: string) => {
      try {
        consola.debug(`Loading document: ${key}`);
        const content = import.meta.webpackContext('../docs')(key) as string;
        consola.success(`Successfully loaded: ${key}`);
        return content;
      } catch (error) {
        consola.error(`Failed to load document "${key}":`, error);
        throw error;
      }
    };

    consola.info('Registering tools...');

    server.tool(
      'ModuleReference',
      'Returns a overview of @praha/byethrow and a list of modules to be exported.',
      () => {
        consola.info('Tool invoked: Module reference');
        return {
          content: [{
            type: 'text',
            text: loadDocument('./modules/Result.md'),
          }],
        };
      },
    );

    server.tool(
      'FunctionReference',
      'Returns a detailed reference of the functions that @praha/byethrow has and an example of how the functions are used.',
      { name: z.string().describe('The name of the function to reference.') },
      ({ name }) => {
        consola.info(`Tool invoked: Function reference -> ${name}`);
        return {
          content: [{
            type: 'text',
            text: loadDocument(`./functions/Result.${name}.md`),
          }],
        };
      },
    );

    server.tool(
      'TypeReference',
      'Returns a detailed reference of the types that @praha/byethrow has and an example of how the types are used.',
      { name: z.string().describe('The name of the type to reference.') },
      ({ name }) => {
        consola.info(`Tool invoked: Type reference -> ${name}`);
        return {
          content: [{
            type: 'text',
            text: loadDocument(`./types/Result.${name}.md`),
          }],
        };
      },
    );

    const transport = new StdioServerTransport();
    consola.info('Connecting server to stdio transport...');
    await server.connect(transport);
    consola.ready('MCP server is up and running!');
  },
});

await runMain(main);
