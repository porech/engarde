"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
const schematics_1 = require("@angular-devkit/schematics");
const schema_1 = require("./schema");
const AI_TOOLS = {
    gemini: {
        rulesName: 'GEMINI.md',
        directory: '.gemini',
    },
    claude: {
        rulesName: 'CLAUDE.md',
        directory: '.claude',
    },
    copilot: {
        rulesName: 'copilot-instructions.md',
        directory: '.github',
    },
    windsurf: {
        rulesName: 'guidelines.md',
        directory: '.windsurf/rules',
    },
    jetbrains: {
        rulesName: 'guidelines.md',
        directory: '.junie',
    },
    // Cursor file has a front matter section.
    cursor: {
        rulesName: 'cursor.mdc',
        directory: '.cursor/rules',
        frontmatter: `---\ncontext: true\npriority: high\nscope: project\n---`,
    },
};
function default_1({ tool }) {
    if (!tool) {
        return (0, schematics_1.noop)();
    }
    const rules = tool
        .filter((tool) => tool !== schema_1.Tool.None)
        .map((selectedTool) => AI_TOOLS[selectedTool])
        .map(({ rulesName, directory, frontmatter }) => (0, schematics_1.mergeWith)((0, schematics_1.apply)((0, schematics_1.url)('./files'), [
        (0, schematics_1.applyTemplates)({
            ...schematics_1.strings,
            rulesName,
            frontmatter,
        }),
        (0, schematics_1.move)(directory),
    ])));
    return (0, schematics_1.chain)(rules);
}
