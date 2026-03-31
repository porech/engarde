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
exports.getMainFilePath = getMainFilePath;
exports.getSourceFile = getSourceFile;
exports.findBootstrapApplicationCall = findBootstrapApplicationCall;
exports.applyChangesToFile = applyChangesToFile;
exports.isMergeAppConfigCall = isMergeAppConfigCall;
exports.findProvidersLiteral = findProvidersLiteral;
const schematics_1 = require("@angular-devkit/schematics");
const posix_1 = require("node:path/posix");
const typescript_1 = __importDefault(require("../../third_party/github.com/Microsoft/TypeScript/lib/typescript"));
const change_1 = require("../change");
const project_targets_1 = require("../project-targets");
const workspace_1 = require("../workspace");
const workspace_models_1 = require("../workspace-models");
/**
 * Finds the main file of a project.
 * @param tree File tree for the project.
 * @param projectName Name of the project in which to search.
 */
async function getMainFilePath(tree, projectName) {
    const workspace = await (0, workspace_1.getWorkspace)(tree);
    const project = workspace.projects.get(projectName);
    const buildTarget = project?.targets.get('build');
    if (!project || !buildTarget) {
        throw (0, project_targets_1.targetBuildNotFoundError)();
    }
    const options = buildTarget.options;
    if (buildTarget.builder === workspace_models_1.Builders.Application ||
        buildTarget.builder === workspace_models_1.Builders.BuildApplication) {
        // These builders support a default of `<project_source_root>/main.ts`
        const projectSourceRoot = project.sourceRoot ?? (0, posix_1.join)(project.root, 'src');
        return options.browser ?? (0, posix_1.join)(projectSourceRoot, 'main.ts');
    }
    return options.main;
}
/**
 * Gets a TypeScript source file at a specific path.
 * @param tree File tree of a project.
 * @param path Path to the file.
 */
function getSourceFile(tree, path) {
    const content = tree.readText(path);
    const source = typescript_1.default.createSourceFile(path, content, typescript_1.default.ScriptTarget.Latest, true);
    return source;
}
/** Finds the call to `bootstrapApplication` within a file. */
function findBootstrapApplicationCall(tree, mainFilePath) {
    const sourceFile = getSourceFile(tree, mainFilePath);
    const localName = findImportLocalName(sourceFile, 'bootstrapApplication', '@angular/platform-browser');
    if (localName) {
        let result = null;
        sourceFile.forEachChild(function walk(node) {
            if (typescript_1.default.isCallExpression(node) &&
                typescript_1.default.isIdentifier(node.expression) &&
                node.expression.text === localName) {
                result = node;
            }
            if (!result) {
                node.forEachChild(walk);
            }
        });
        if (result) {
            return result;
        }
    }
    throw new schematics_1.SchematicsException(`Could not find bootstrapApplication call in ${mainFilePath}`);
}
/**
 * Finds the local name of an imported symbol. Could be the symbol name itself or its alias.
 * @param sourceFile File within which to search for the import.
 * @param name Actual name of the import, not its local alias.
 * @param moduleName Name of the module from which the symbol is imported.
 */
function findImportLocalName(sourceFile, name, moduleName) {
    for (const node of sourceFile.statements) {
        // Only look for top-level imports.
        if (!typescript_1.default.isImportDeclaration(node) ||
            !typescript_1.default.isStringLiteral(node.moduleSpecifier) ||
            node.moduleSpecifier.text !== moduleName) {
            continue;
        }
        // Filter out imports that don't have the right shape.
        if (!node.importClause ||
            !node.importClause.namedBindings ||
            !typescript_1.default.isNamedImports(node.importClause.namedBindings)) {
            continue;
        }
        // Look through the elements of the declaration for the specific import.
        for (const element of node.importClause.namedBindings.elements) {
            if ((element.propertyName || element.name).text === name) {
                // The local name is always in `name`.
                return element.name.text;
            }
        }
    }
    return null;
}
/**
 * Applies a set of changes to a file.
 * @param tree File tree of the project.
 * @param path Path to the file that is being changed.
 * @param changes Changes that should be applied to the file.
 */
function applyChangesToFile(tree, path, changes) {
    if (changes.length > 0) {
        const recorder = tree.beginUpdate(path);
        (0, change_1.applyToUpdateRecorder)(recorder, changes);
        tree.commitUpdate(recorder);
    }
}
/** Checks whether a node is a call to `mergeApplicationConfig`. */
function isMergeAppConfigCall(node) {
    if (!typescript_1.default.isCallExpression(node)) {
        return false;
    }
    const localName = findImportLocalName(node.getSourceFile(), 'mergeApplicationConfig', '@angular/core');
    return !!localName && typescript_1.default.isIdentifier(node.expression) && node.expression.text === localName;
}
/** Finds the `providers` array literal within an application config. */
function findProvidersLiteral(config) {
    for (const prop of config.properties) {
        if (typescript_1.default.isPropertyAssignment(prop) &&
            typescript_1.default.isIdentifier(prop.name) &&
            prop.name.text === 'providers' &&
            typescript_1.default.isArrayLiteralExpression(prop.initializer)) {
            return prop.initializer;
        }
    }
    return null;
}
