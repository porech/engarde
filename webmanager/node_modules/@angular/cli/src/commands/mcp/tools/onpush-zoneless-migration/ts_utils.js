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
exports.loadTypescript = loadTypescript;
exports.getImportSpecifier = getImportSpecifier;
exports.findImportSpecifier = findImportSpecifier;
exports.createSourceFile = createSourceFile;
const fs = __importStar(require("node:fs"));
let typescriptModule;
async function loadTypescript() {
    return (typescriptModule ??= await Promise.resolve().then(() => __importStar(require('typescript'))));
}
/**
 * Gets a top-level import specifier with a specific name that is imported from a particular module.
 * E.g. given a file that looks like:
 *
 * ```ts
 * import { Component, Directive } from '@angular/core';
 * import { Foo } from './foo';
 * ```
 *
 * Calling `getImportSpecifier(sourceFile, '@angular/core', 'Directive')` will yield the node
 * referring to `Directive` in the top import.
 *
 * @param sourceFile File in which to look for imports.
 * @param moduleName Name of the import's module.
 * @param specifierName Original name of the specifier to look for. Aliases will be resolved to
 *    their original name.
 */
async function getImportSpecifier(sourceFile, moduleName, specifierName) {
    return (getImportSpecifiers(sourceFile, moduleName, specifierName, await loadTypescript())[0] ?? null);
}
/**
 * Gets top-level import specifiers with specific names that are imported from a particular module.
 * E.g. given a file that looks like:
 *
 * ```ts
 * import { Component, Directive } from '@angular/core';
 * import { Foo } from './foo';
 * ```
 *
 * Calling `getImportSpecifiers(sourceFile, '@angular/core', ['Directive', 'Component'])` will
 * yield the nodes referring to `Directive` and `Component` in the top import.
 *
 * @param sourceFile File in which to look for imports.
 * @param moduleName Name of the import's module.
 * @param specifierOrSpecifiers Original name of the specifier to look for, or an array of such
 *   names. Aliases will be resolved to their original name.
 */
function getImportSpecifiers(sourceFile, moduleName, specifierOrSpecifiers, { isNamedImports, isImportDeclaration, isStringLiteral }) {
    const matches = [];
    for (const node of sourceFile.statements) {
        if (!isImportDeclaration(node) || !isStringLiteral(node.moduleSpecifier)) {
            continue;
        }
        const namedBindings = node.importClause?.namedBindings;
        const isMatch = typeof moduleName === 'string'
            ? node.moduleSpecifier.text === moduleName
            : moduleName.test(node.moduleSpecifier.text);
        if (!isMatch || !namedBindings || !isNamedImports(namedBindings)) {
            continue;
        }
        if (typeof specifierOrSpecifiers === 'string') {
            const match = findImportSpecifier(namedBindings.elements, specifierOrSpecifiers);
            if (match) {
                matches.push(match);
            }
        }
        else {
            for (const specifierName of specifierOrSpecifiers) {
                const match = findImportSpecifier(namedBindings.elements, specifierName);
                if (match) {
                    matches.push(match);
                }
            }
        }
    }
    return matches;
}
/**
 * Finds an import specifier with a particular name.
 * @param nodes Array of import specifiers to search through.
 * @param specifierName Name of the specifier to look for.
 */
function findImportSpecifier(nodes, specifierName) {
    return nodes.find((element) => {
        const { name, propertyName } = element;
        return propertyName ? propertyName.text === specifierName : name.text === specifierName;
    });
}
/** Creates a TypeScript source file from a file path. */
async function createSourceFile(file) {
    const content = fs.readFileSync(file, 'utf8');
    const ts = await loadTypescript();
    return ts.createSourceFile(file, content, ts.ScriptTarget.Latest, true);
}
