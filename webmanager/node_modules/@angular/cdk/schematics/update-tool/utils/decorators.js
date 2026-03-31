"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAngularDecorators = getAngularDecorators;
exports.getCallDecoratorImport = getCallDecoratorImport;
const ts = require("typescript");
const imports_1 = require("./imports");
/**
 * Gets all decorators which are imported from an Angular package
 * (e.g. "@angular/core") from a list of decorators.
 */
function getAngularDecorators(typeChecker, decorators) {
    return decorators
        .map(node => ({ node, importData: getCallDecoratorImport(typeChecker, node) }))
        .filter(({ importData }) => importData && importData.moduleName.startsWith('@angular/'))
        .map(({ node, importData }) => ({
        node: node,
        name: importData.symbolName,
    }));
}
function getCallDecoratorImport(typeChecker, decorator) {
    if (!ts.isCallExpression(decorator.expression)) {
        return null;
    }
    const valueExpr = decorator.expression.expression;
    let identifier = null;
    if (ts.isIdentifier(valueExpr)) {
        identifier = valueExpr;
    }
    else if (ts.isPropertyAccessExpression(valueExpr) && ts.isIdentifier(valueExpr.name)) {
        identifier = valueExpr.name;
    }
    return identifier ? (0, imports_1.getImportOfIdentifier)(identifier, typeChecker) : null;
}
//# sourceMappingURL=decorators.js.map