"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
const ts = __importStar(require("../../third_party/github.com/Microsoft/TypeScript/lib/typescript"));
const dependencies_1 = require("../../utility/dependencies");
function* visit(directory) {
    for (const path of directory.subfiles) {
        if (path.endsWith('.ts') && !path.endsWith('.d.ts')) {
            const entry = directory.file(path);
            if (entry) {
                const content = entry.content;
                if ((content.includes('provideServerRouting') ||
                    content.includes('provideServerRoutesConfig')) &&
                    content.includes('@angular/ssr')) {
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
        if (!(0, dependencies_1.getPackageJsonDependency)(tree, '@angular/ssr')) {
            return;
        }
        for (const [filePath, content] of visit(tree.root)) {
            const recorder = tree.beginUpdate(filePath);
            const sourceFile = ts.createSourceFile(filePath, content, ts.ScriptTarget.Latest, true);
            function visit(node) {
                if (ts.isPropertyAssignment(node) &&
                    ts.isIdentifier(node.name) &&
                    node.name.text === 'providers' &&
                    ts.isArrayLiteralExpression(node.initializer)) {
                    const providersArray = node.initializer;
                    const newProviders = providersArray.elements
                        .filter((el) => {
                        return !(ts.isCallExpression(el) &&
                            ts.isIdentifier(el.expression) &&
                            el.expression.text === 'provideServerRendering');
                    })
                        .map((el) => {
                        if (ts.isCallExpression(el) &&
                            ts.isIdentifier(el.expression) &&
                            (el.expression.text === 'provideServerRouting' ||
                                el.expression.text === 'provideServerRoutesConfig')) {
                            const [withRouteVal, ...others] = el.arguments.map((arg) => arg.getText());
                            return `provideServerRendering(withRoutes(${withRouteVal})${others.length ? ', ' + others.join(', ') : ''})`;
                        }
                        return el.getText();
                    });
                    // Update the 'providers' array in the source file
                    recorder.remove(providersArray.getStart(), providersArray.getWidth());
                    recorder.insertRight(providersArray.getStart(), `[${newProviders.join(', ')}]`);
                }
                ts.forEachChild(node, visit);
            }
            // Visit all nodes to update 'providers'
            visit(sourceFile);
            // Update imports by removing 'provideServerRouting'
            const importDecl = sourceFile.statements.find((stmt) => ts.isImportDeclaration(stmt) &&
                ts.isStringLiteral(stmt.moduleSpecifier) &&
                stmt.moduleSpecifier.text === '@angular/ssr');
            if (importDecl?.importClause?.namedBindings) {
                const namedBindings = importDecl?.importClause.namedBindings;
                if (ts.isNamedImports(namedBindings)) {
                    const elements = namedBindings.elements;
                    const updatedElements = elements
                        .map((el) => el.getText())
                        .filter((x) => x !== 'provideServerRouting' && x !== 'provideServerRoutesConfig');
                    updatedElements.push('withRoutes');
                    recorder.remove(namedBindings.getStart(), namedBindings.getWidth());
                    recorder.insertLeft(namedBindings.getStart(), `{ ${updatedElements.sort().join(', ')} }`);
                }
            }
            tree.commitUpdate(recorder);
        }
    };
}
