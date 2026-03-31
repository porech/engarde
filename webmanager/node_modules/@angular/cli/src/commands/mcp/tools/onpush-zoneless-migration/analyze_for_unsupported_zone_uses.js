"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzeForUnsupportedZoneUses = analyzeForUnsupportedZoneUses;
exports.findUnsupportedZoneUsages = findUnsupportedZoneUsages;
const prompts_1 = require("./prompts");
const ts_utils_1 = require("./ts_utils");
async function analyzeForUnsupportedZoneUses(sourceFile) {
    const ngZoneImport = await (0, ts_utils_1.getImportSpecifier)(sourceFile, '@angular/core', 'NgZone');
    if (!ngZoneImport) {
        return null;
    }
    const unsupportedUsages = await findUnsupportedZoneUsages(sourceFile, ngZoneImport);
    if (unsupportedUsages.length === 0) {
        return null;
    }
    const locations = unsupportedUsages.map((node) => {
        const { line, character } = sourceFile.getLineAndCharacterOfPosition(node.getStart());
        return `line ${line + 1}, character ${character + 1}: ${node.getText()}`;
    });
    return (0, prompts_1.createUnsupportedZoneUsagesMessage)(locations, sourceFile.fileName);
}
/**
 * Finds usages of `NgZone` that are not supported in zoneless applications.
 * @param sourceFile The source file to check.
 * @param ngZoneImport The import specifier for `NgZone`.
 * @returns A list of nodes that are unsupported `NgZone` usages.
 */
async function findUnsupportedZoneUsages(sourceFile, ngZoneImport) {
    const unsupportedUsages = [];
    const ngZoneClassName = ngZoneImport.name.text;
    const staticMethods = new Set([
        'isInAngularZone',
        'assertInAngularZone',
        'assertNotInAngularZone',
    ]);
    const instanceMethods = new Set(['onMicrotaskEmpty', 'onStable']);
    const ts = await (0, ts_utils_1.loadTypescript)();
    ts.forEachChild(sourceFile, function visit(node) {
        if (ts.isPropertyAccessExpression(node)) {
            const propertyName = node.name.text;
            const expressionText = node.expression.getText(sourceFile);
            // Static: NgZone.method()
            if (expressionText === ngZoneClassName && staticMethods.has(propertyName)) {
                unsupportedUsages.push(node);
            }
            // Instance: zone.method() or this.zone.method()
            if (instanceMethods.has(propertyName)) {
                unsupportedUsages.push(node);
            }
        }
        ts.forEachChild(node, visit);
    });
    return unsupportedUsages;
}
