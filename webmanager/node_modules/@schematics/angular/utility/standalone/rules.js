"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.addRootImport = addRootImport;
exports.addRootProvider = addRootProvider;
const core_1 = require("@angular-devkit/core");
const schematics_1 = require("@angular-devkit/schematics");
const ast_utils_1 = require("../ast-utils");
const change_1 = require("../change");
const ng_ast_utils_1 = require("../ng-ast-utils");
const app_config_1 = require("./app_config");
const code_block_1 = require("./code_block");
const util_1 = require("./util");
/**
 * Adds an import to the root of the project.
 * @param project Name of the project to which to add the import.
 * @param callback Function that generates the code block which should be inserted.
 * @example
 *
 * ```ts
 * import { Rule } from '@angular-devkit/schematics';
 * import { addRootImport } from '@schematics/angular/utility';
 *
 * export default function(): Rule {
 *   return addRootImport('default', ({code, external}) => {
 *     return code`${external('MyModule', '@my/module')}.forRoot({})`;
 *   });
 * }
 * ```
 */
function addRootImport(project, callback) {
    return getRootInsertionRule(project, callback, 'imports', {
        name: 'importProvidersFrom',
        module: '@angular/core',
    });
}
/**
 * Adds a provider to the root of the project.
 * @param project Name of the project to which to add the import.
 * @param callback Function that generates the code block which should be inserted.
 * @example
 *
 * ```ts
 * import { Rule } from '@angular-devkit/schematics';
 * import { addRootProvider } from '@schematics/angular/utility';
 *
 * export default function(): Rule {
 *   return addRootProvider('default', ({code, external}) => {
 *     return code`${external('provideLibrary', '@my/library')}({})`;
 *   });
 * }
 * ```
 */
function addRootProvider(project, callback) {
    return getRootInsertionRule(project, callback, 'providers');
}
/**
 * Creates a rule that inserts code at the root of either a standalone or NgModule-based project.
 * @param project Name of the project into which to inser tthe code.
 * @param callback Function that generates the code block which should be inserted.
 * @param ngModuleField Field of the root NgModule into which the code should be inserted, if the
 * app is based on NgModule
 * @param standaloneWrapperFunction Function with which to wrap the code if the app is standalone.
 */
function getRootInsertionRule(project, callback, ngModuleField, standaloneWrapperFunction) {
    return async (host) => {
        const mainFilePath = await (0, util_1.getMainFilePath)(host, project);
        const codeBlock = new code_block_1.CodeBlock();
        if ((0, ng_ast_utils_1.isStandaloneApp)(host, mainFilePath)) {
            return (tree) => addProviderToStandaloneBootstrap(tree, callback(codeBlock), mainFilePath, standaloneWrapperFunction);
        }
        const modulePath = (0, ng_ast_utils_1.getAppModulePath)(host, mainFilePath);
        const pendingCode = code_block_1.CodeBlock.transformPendingCode(callback(codeBlock), modulePath);
        return (0, schematics_1.chain)([
            ...pendingCode.rules,
            (tree) => {
                const changes = (0, ast_utils_1.addSymbolToNgModuleMetadata)((0, util_1.getSourceFile)(tree, modulePath), modulePath, ngModuleField, pendingCode.code.expression, 
                // Explicitly set the import path to null since we deal with imports here separately.
                null);
                (0, util_1.applyChangesToFile)(tree, modulePath, changes);
            },
        ]);
    };
}
/**
 * Adds a provider to the root of a standalone project.
 * @param host Tree of the root rule.
 * @param pendingCode Code that should be inserted.
 * @param mainFilePath Path to the project's main file.
 * @param wrapperFunction Optional function with which to wrap the provider.
 */
function addProviderToStandaloneBootstrap(host, pendingCode, mainFilePath, wrapperFunction) {
    const bootstrapCall = (0, util_1.findBootstrapApplicationCall)(host, mainFilePath);
    const fileToEdit = (0, app_config_1.findAppConfig)(bootstrapCall, host, mainFilePath)?.filePath || mainFilePath;
    const { code, rules } = code_block_1.CodeBlock.transformPendingCode(pendingCode, fileToEdit);
    return (0, schematics_1.chain)([
        ...rules,
        () => {
            let wrapped;
            let additionalRules;
            if (wrapperFunction) {
                const block = new code_block_1.CodeBlock();
                const result = code_block_1.CodeBlock.transformPendingCode(block.code `${block.external(wrapperFunction.name, wrapperFunction.module)}(${code.expression})`, fileToEdit);
                wrapped = result.code;
                additionalRules = result.rules;
            }
            else {
                wrapped = code;
                additionalRules = [];
            }
            return (0, schematics_1.chain)([
                ...additionalRules,
                (tree) => insertStandaloneRootProvider(tree, mainFilePath, wrapped.expression),
            ]);
        },
    ]);
}
/**
 * Inserts a string expression into the root of a standalone project.
 * @param tree File tree used to modify the project.
 * @param mainFilePath Path to the main file of the project.
 * @param expression Code expression to be inserted.
 */
function insertStandaloneRootProvider(tree, mainFilePath, expression) {
    const bootstrapCall = (0, util_1.findBootstrapApplicationCall)(tree, mainFilePath);
    const appConfig = (0, app_config_1.findAppConfig)(bootstrapCall, tree, mainFilePath);
    if (bootstrapCall.arguments.length === 0) {
        throw new schematics_1.SchematicsException(`Cannot add provider to invalid bootstrapApplication call in ${bootstrapCall.getSourceFile().fileName}`);
    }
    if (appConfig) {
        addProvidersExpressionToAppConfig(tree, appConfig, expression);
        return;
    }
    const newAppConfig = `, {\n${core_1.tags.indentBy(2) `providers: [${expression}]`}\n}`;
    let targetCall;
    if (bootstrapCall.arguments.length === 1) {
        targetCall = bootstrapCall;
    }
    else if ((0, util_1.isMergeAppConfigCall)(bootstrapCall.arguments[1])) {
        targetCall = bootstrapCall.arguments[1];
    }
    else {
        throw new schematics_1.SchematicsException(`Cannot statically analyze bootstrapApplication call in ${bootstrapCall.getSourceFile().fileName}`);
    }
    (0, util_1.applyChangesToFile)(tree, mainFilePath, [
        (0, ast_utils_1.insertAfterLastOccurrence)(targetCall.arguments, newAppConfig, mainFilePath, targetCall.getEnd() - 1),
    ]);
}
/**
 * Adds a string expression to an app config object.
 * @param tree File tree used to modify the project.
 * @param appConfig Resolved configuration object of the project.
 * @param expression Code expression to be inserted.
 */
function addProvidersExpressionToAppConfig(tree, appConfig, expression) {
    const { node, filePath } = appConfig;
    const configProps = node.properties;
    const providersLiteral = (0, util_1.findProvidersLiteral)(node);
    // If there's a `providers` property, we can add the provider
    // to it, otherwise we need to declare it ourselves.
    if (providersLiteral) {
        (0, util_1.applyChangesToFile)(tree, filePath, [
            (0, ast_utils_1.insertAfterLastOccurrence)(providersLiteral.elements, (providersLiteral.elements.length === 0 ? '' : ', ') + expression, filePath, providersLiteral.getStart() + 1),
        ]);
    }
    else {
        const prop = core_1.tags.indentBy(2) `providers: [${expression}]`;
        let toInsert;
        let insertPosition;
        if (configProps.length === 0) {
            toInsert = '\n' + prop + '\n';
            insertPosition = node.getEnd() - 1;
        }
        else {
            const hasTrailingComma = configProps.hasTrailingComma;
            toInsert = (hasTrailingComma ? '' : ',') + '\n' + prop;
            insertPosition = configProps[configProps.length - 1].getEnd() + (hasTrailingComma ? 1 : 0);
        }
        (0, util_1.applyChangesToFile)(tree, filePath, [new change_1.InsertChange(filePath, insertPosition, toInsert)]);
    }
}
