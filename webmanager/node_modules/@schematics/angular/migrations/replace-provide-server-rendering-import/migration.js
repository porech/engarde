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
exports.default = default_1;
const typescript_1 = __importDefault(require("../../third_party/github.com/Microsoft/TypeScript/lib/typescript"));
const dependency_1 = require("../../utility/dependency");
const latest_versions_1 = require("../../utility/latest-versions");
function* visit(directory) {
    for (const path of directory.subfiles) {
        if (path.endsWith('.ts') && !path.endsWith('.d.ts')) {
            const entry = directory.file(path);
            if (entry) {
                const content = entry.content;
                if (content.includes('provideServerRendering') &&
                    content.includes('@angular/platform-server')) {
                    // Only need to rename the import so we can just string replacements.
                    yield [entry.path, content.toString()];
                }
            }
        }
    }
    for (const path of directory.subdirs) {
        if (path === 'node_modules' || path.startsWith('.')) {
            continue;
        }
        yield* visit(directory.dir(path));
    }
}
function default_1() {
    return async (tree) => {
        let rule;
        for (const [filePath, content] of visit(tree.root)) {
            let updatedContent = content;
            const ssrImports = new Set();
            const platformServerImports = new Set();
            const sourceFile = typescript_1.default.createSourceFile(filePath, content, typescript_1.default.ScriptTarget.Latest, true);
            sourceFile.forEachChild((node) => {
                if (typescript_1.default.isImportDeclaration(node)) {
                    const moduleSpecifier = node.moduleSpecifier.getText(sourceFile);
                    if (moduleSpecifier.includes('@angular/platform-server')) {
                        const importClause = node.importClause;
                        if (importClause &&
                            importClause.namedBindings &&
                            typescript_1.default.isNamedImports(importClause.namedBindings)) {
                            const namedImports = importClause.namedBindings.elements.map((e) => e.getText(sourceFile));
                            namedImports.forEach((importName) => {
                                if (importName === 'provideServerRendering') {
                                    ssrImports.add(importName);
                                }
                                else {
                                    platformServerImports.add(importName);
                                }
                            });
                        }
                        updatedContent = updatedContent.replace(node.getFullText(sourceFile), '');
                    }
                    else if (moduleSpecifier.includes('@angular/ssr')) {
                        const importClause = node.importClause;
                        if (importClause &&
                            importClause.namedBindings &&
                            typescript_1.default.isNamedImports(importClause.namedBindings)) {
                            importClause.namedBindings.elements.forEach((e) => {
                                ssrImports.add(e.getText(sourceFile));
                            });
                        }
                        updatedContent = updatedContent.replace(node.getFullText(sourceFile), '');
                    }
                }
            });
            if (platformServerImports.size > 0) {
                updatedContent =
                    `import { ${Array.from(platformServerImports).sort().join(', ')} } from '@angular/platform-server';\n` +
                        updatedContent;
            }
            if (ssrImports.size > 0) {
                updatedContent =
                    `import { ${Array.from(ssrImports).sort().join(', ')} } from '@angular/ssr';\n` +
                        updatedContent;
            }
            if (content !== updatedContent) {
                tree.overwrite(filePath, updatedContent);
                if (rule === undefined) {
                    rule = (0, dependency_1.addDependency)('@angular/ssr', latest_versions_1.latestVersions.AngularSSR);
                }
            }
        }
        return rule;
    };
}
