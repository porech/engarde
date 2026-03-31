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
exports.resolveBootstrappedComponentData = resolveBootstrappedComponentData;
const schematics_1 = require("@angular-devkit/schematics");
const typescript_1 = __importDefault(require("../../third_party/github.com/Microsoft/TypeScript/lib/typescript"));
const ast_utils_1 = require("../ast-utils");
const ng_ast_utils_1 = require("../ng-ast-utils");
const util_1 = require("./util");
/**
 * Finds the original name and path relative to the `main.ts` of the bootrstrapped app component.
 * @param tree File tree in which to look for the component.
 * @param mainFilePath Path of the `main` file.
 */
function resolveBootstrappedComponentData(tree, mainFilePath) {
    // First try to resolve for a standalone app.
    try {
        const call = (0, util_1.findBootstrapApplicationCall)(tree, mainFilePath);
        if (call.arguments.length > 0 && typescript_1.default.isIdentifier(call.arguments[0])) {
            const resolved = resolveIdentifier(call.arguments[0]);
            if (resolved) {
                return {
                    componentName: resolved.name,
                    componentImportPathInSameFile: resolved.path,
                    moduleName: null,
                    moduleImportPathInSameFile: null,
                };
            }
        }
    }
    catch (e) {
        // `findBootstrapApplicationCall` will throw if it can't find the `bootrstrapApplication` call.
        // Catch so we can continue to the fallback logic.
        if (!(e instanceof schematics_1.SchematicsException)) {
            throw e;
        }
    }
    // Otherwise fall back to resolving an NgModule-based app.
    return resolveNgModuleBasedData(tree, mainFilePath);
}
/** Resolves the bootstrap data for a NgModule-based app. */
function resolveNgModuleBasedData(tree, mainFilePath) {
    const appModulePath = (0, ng_ast_utils_1.getAppModulePath)(tree, mainFilePath);
    const appModuleFile = (0, util_1.getSourceFile)(tree, appModulePath);
    const metadataNodes = (0, ast_utils_1.getDecoratorMetadata)(appModuleFile, 'NgModule', '@angular/core');
    for (const node of metadataNodes) {
        if (!typescript_1.default.isObjectLiteralExpression(node)) {
            continue;
        }
        const bootstrapProp = (0, ast_utils_1.getMetadataField)(node, 'bootstrap').find((prop) => {
            return (typescript_1.default.isArrayLiteralExpression(prop.initializer) &&
                prop.initializer.elements.length > 0 &&
                typescript_1.default.isIdentifier(prop.initializer.elements[0]));
        });
        const componentIdentifier = (bootstrapProp?.initializer)
            .elements[0];
        const componentResult = componentIdentifier ? resolveIdentifier(componentIdentifier) : null;
        const bootstrapCall = (0, ng_ast_utils_1.findBootstrapModuleCall)(tree, mainFilePath);
        if (componentResult &&
            bootstrapCall &&
            bootstrapCall.arguments.length > 0 &&
            typescript_1.default.isIdentifier(bootstrapCall.arguments[0])) {
            const moduleResult = resolveIdentifier(bootstrapCall.arguments[0]);
            if (moduleResult) {
                return {
                    componentName: componentResult.name,
                    componentImportPathInSameFile: componentResult.path,
                    moduleName: moduleResult.name,
                    moduleImportPathInSameFile: moduleResult.path,
                };
            }
        }
    }
    return null;
}
/** Resolves an identifier to its original name and path that it was imported from. */
function resolveIdentifier(identifier) {
    const sourceFile = identifier.getSourceFile();
    // Try to resolve the import path by looking at the top-level named imports of the file.
    for (const node of sourceFile.statements) {
        if (!typescript_1.default.isImportDeclaration(node) ||
            !typescript_1.default.isStringLiteral(node.moduleSpecifier) ||
            !node.importClause ||
            !node.importClause.namedBindings ||
            !typescript_1.default.isNamedImports(node.importClause.namedBindings)) {
            continue;
        }
        for (const element of node.importClause.namedBindings.elements) {
            if (element.name.text === identifier.text) {
                return {
                    // Note that we use `propertyName` if available, because it contains
                    // the real name in the case where the import is aliased.
                    name: (element.propertyName || element.name).text,
                    path: node.moduleSpecifier.text,
                };
            }
        }
    }
    return null;
}
