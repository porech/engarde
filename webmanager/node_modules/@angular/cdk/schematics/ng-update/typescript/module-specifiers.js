"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.cdkModuleSpecifier = exports.materialModuleSpecifier = void 0;
exports.isMaterialImportDeclaration = isMaterialImportDeclaration;
exports.isMaterialExportDeclaration = isMaterialExportDeclaration;
const imports_1 = require("../typescript/imports");
/** Name of the Angular Material module specifier. */
exports.materialModuleSpecifier = '@angular/material';
/** Name of the Angular CDK module specifier. */
exports.cdkModuleSpecifier = '@angular/cdk';
/** Whether the specified node is part of an Angular Material or CDK import declaration. */
function isMaterialImportDeclaration(node) {
    return isMaterialDeclaration((0, imports_1.getImportDeclaration)(node));
}
/** Whether the specified node is part of an Angular Material or CDK import declaration. */
function isMaterialExportDeclaration(node) {
    return isMaterialDeclaration((0, imports_1.getExportDeclaration)(node));
}
/** Whether the declaration is part of Angular Material. */
function isMaterialDeclaration(declaration) {
    if (!declaration.moduleSpecifier) {
        return false;
    }
    const moduleSpecifier = declaration.moduleSpecifier.getText();
    return (moduleSpecifier.indexOf(exports.materialModuleSpecifier) !== -1 ||
        moduleSpecifier.indexOf(exports.cdkModuleSpecifier) !== -1);
}
//# sourceMappingURL=module-specifiers.js.map