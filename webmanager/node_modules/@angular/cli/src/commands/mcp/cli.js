"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
const stdio_js_1 = require("@modelcontextprotocol/sdk/server/stdio.js");
const command_module_1 = require("../../command-builder/command-module");
const tty_1 = require("../../utilities/tty");
const mcp_server_1 = require("./mcp-server");
const INTERACTIVE_MESSAGE = `
To start using the Angular CLI MCP Server, add this configuration to your host:

{
  "mcpServers": {
    "angular-cli": {
      "command": "npx",
      "args": ["-y", "@angular/cli", "mcp"]
    }
  }
}

Exact configuration may differ depending on the host.

For more information and documentation, visit: https://angular.dev/ai/mcp
`;
class McpCommandModule extends command_module_1.CommandModule {
    command = 'mcp';
    describe = false;
    longDescriptionPath = undefined;
    builder(localYargs) {
        return localYargs
            .option('read-only', {
            type: 'boolean',
            default: false,
            describe: 'Only register read-only tools.',
        })
            .option('local-only', {
            type: 'boolean',
            default: false,
            describe: 'Only register tools that do not require internet access.',
        })
            .option('experimental-tool', {
            type: 'string',
            alias: 'E',
            array: true,
            describe: 'Enable an experimental tool.',
            choices: mcp_server_1.EXPERIMENTAL_TOOLS.map(({ name }) => name),
            hidden: true,
        });
    }
    async run(options) {
        if ((0, tty_1.isTTY)()) {
            this.context.logger.info(INTERACTIVE_MESSAGE);
            return;
        }
        const server = await (0, mcp_server_1.createMcpServer)({
            workspace: this.context.workspace,
            readOnly: options.readOnly,
            localOnly: options.localOnly,
            experimentalTools: options.experimentalTool,
        }, this.context.logger);
        const transport = new stdio_js_1.StdioServerTransport();
        await server.connect(transport);
    }
}
exports.default = McpCommandModule;
