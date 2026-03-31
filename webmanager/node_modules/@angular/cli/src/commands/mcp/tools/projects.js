"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LIST_PROJECTS_TOOL = void 0;
const node_path_1 = __importDefault(require("node:path"));
const zod_1 = __importDefault(require("zod"));
const tool_registry_1 = require("./tool-registry");
exports.LIST_PROJECTS_TOOL = (0, tool_registry_1.declareTool)({
    name: 'list_projects',
    title: 'List Angular Projects',
    description: 'Lists the names of all applications and libraries defined within an Angular workspace. ' +
        'It reads the `angular.json` configuration file to identify the projects. ',
    outputSchema: {
        projects: zod_1.default.array(zod_1.default.object({
            name: zod_1.default
                .string()
                .describe('The name of the project, as defined in the `angular.json` file.'),
            type: zod_1.default
                .enum(['application', 'library'])
                .optional()
                .describe(`The type of the project, either 'application' or 'library'.`),
            root: zod_1.default
                .string()
                .describe('The root directory of the project, relative to the workspace root.'),
            sourceRoot: zod_1.default
                .string()
                .describe(`The root directory of the project's source files, relative to the workspace root.`),
            selectorPrefix: zod_1.default
                .string()
                .optional()
                .describe('The prefix to use for component selectors.' +
                ` For example, a prefix of 'app' would result in selectors like '<app-my-component>'.`),
        })),
    },
    isReadOnly: true,
    isLocalOnly: true,
    shouldRegister: (context) => !!context.workspace,
    factory: createListProjectsHandler,
});
function createListProjectsHandler({ workspace }) {
    return async () => {
        if (!workspace) {
            return {
                content: [
                    {
                        type: 'text',
                        text: 'No Angular workspace found.' +
                            ' An `angular.json` file, which marks the root of a workspace,' +
                            ' could not be located in the current directory or any of its parent directories.',
                    },
                ],
                structuredContent: { projects: [] },
            };
        }
        const projects = [];
        // Convert to output format
        for (const [name, project] of workspace.projects.entries()) {
            projects.push({
                name,
                type: project.extensions['projectType'],
                root: project.root,
                sourceRoot: project.sourceRoot ?? node_path_1.default.posix.join(project.root, 'src'),
                selectorPrefix: project.extensions['prefix'],
            });
        }
        // The structuredContent field is newer and may not be supported by all hosts.
        // A text representation of the content is also provided for compatibility.
        return {
            content: [
                {
                    type: 'text',
                    text: `Projects in the Angular workspace:\n${JSON.stringify(projects)}`,
                },
            ],
            structuredContent: { projects },
        };
    };
}
