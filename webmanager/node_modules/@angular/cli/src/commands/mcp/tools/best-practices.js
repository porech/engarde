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
exports.BEST_PRACTICES_TOOL = void 0;
const promises_1 = require("node:fs/promises");
const node_path_1 = __importDefault(require("node:path"));
const tool_registry_1 = require("./tool-registry");
exports.BEST_PRACTICES_TOOL = (0, tool_registry_1.declareTool)({
    name: 'get_best_practices',
    title: 'Get Angular Coding Best Practices Guide',
    description: `
<Purpose>
Retrieves the official Angular Best Practices Guide. This guide contains the essential rules and conventions
that **MUST** be followed for any task involving the creation, analysis, or modification of Angular code.
</Purpose>
<Use Cases>
* As a mandatory first step before writing or modifying any Angular code to ensure adherence to modern standards.
* To learn about key concepts like standalone components, typed forms, and modern control flow syntax (@if, @for, @switch).
* To verify that existing code aligns with current Angular conventions before making changes.
</Use Cases>
<Operational Notes>
* The content of this guide is non-negotiable and reflects the official, up-to-date standards for Angular development.
* You **MUST** internalize and apply the principles from this guide in all subsequent Angular-related tasks.
* Failure to adhere to these best practices will result in suboptimal and outdated code.
</Operational Notes>`,
    isReadOnly: true,
    isLocalOnly: true,
    factory: () => {
        let bestPracticesText;
        return async () => {
            bestPracticesText ??= await (0, promises_1.readFile)(node_path_1.default.join(__dirname, '..', 'resources', 'best-practices.md'), 'utf-8');
            return {
                content: [
                    {
                        type: 'text',
                        text: bestPracticesText,
                        annotations: {
                            audience: ['assistant'],
                            priority: 0.9,
                        },
                    },
                ],
            };
        };
    },
});
