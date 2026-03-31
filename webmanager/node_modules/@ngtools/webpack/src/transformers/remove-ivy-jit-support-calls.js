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
exports.removeIvyJitSupportCalls = removeIvyJitSupportCalls;
const ts = __importStar(require("typescript"));
const elide_imports_1 = require("./elide_imports");
function removeIvyJitSupportCalls(classMetadata, ngModuleScope, debugInfo, getTypeChecker) {
    return (context) => {
        const removedNodes = [];
        const visitNode = (node) => {
            const innerExpression = ts.isExpressionStatement(node) ? getIifeExpression(node) : null;
            if (innerExpression) {
                if (ngModuleScope &&
                    ts.isBinaryExpression(innerExpression) &&
                    isIvyPrivateCallExpression(innerExpression.right, 'ɵɵsetNgModuleScope')) {
                    removedNodes.push(innerExpression);
                    return undefined;
                }
                if (classMetadata) {
                    const expression = ts.isBinaryExpression(innerExpression)
                        ? innerExpression.right
                        : innerExpression;
                    if (isIvyPrivateCallExpression(expression, 'ɵsetClassMetadata') ||
                        isIvyPrivateCallExpression(expression, 'ɵsetClassMetadataAsync')) {
                        removedNodes.push(innerExpression);
                        return undefined;
                    }
                }
                if (debugInfo &&
                    ts.isBinaryExpression(innerExpression) &&
                    isIvyPrivateCallExpression(innerExpression.right, 'ɵsetClassDebugInfo')) {
                    removedNodes.push(innerExpression);
                    return undefined;
                }
            }
            return ts.visitEachChild(node, visitNode, context);
        };
        return (sourceFile) => {
            let updatedSourceFile = ts.visitEachChild(sourceFile, visitNode, context);
            if (removedNodes.length > 0) {
                // Remove any unused imports
                const importRemovals = (0, elide_imports_1.elideImports)(updatedSourceFile, removedNodes, getTypeChecker, context.getCompilerOptions());
                if (importRemovals.size > 0) {
                    updatedSourceFile = ts.visitEachChild(updatedSourceFile, function visitForRemoval(node) {
                        return importRemovals.has(node)
                            ? undefined
                            : ts.visitEachChild(node, visitForRemoval, context);
                    }, context);
                }
            }
            return updatedSourceFile;
        };
    };
}
// Each Ivy private call expression is inside an IIFE
function getIifeExpression(exprStmt) {
    const expression = exprStmt.expression;
    if (!expression || !ts.isCallExpression(expression) || expression.arguments.length !== 0) {
        return null;
    }
    const parenExpr = expression;
    if (!ts.isParenthesizedExpression(parenExpr.expression)) {
        return null;
    }
    const funExpr = parenExpr.expression.expression;
    if (!ts.isFunctionExpression(funExpr) && !ts.isArrowFunction(funExpr)) {
        return null;
    }
    if (!ts.isBlock(funExpr.body)) {
        return funExpr.body;
    }
    const innerStmts = funExpr.body.statements;
    if (innerStmts.length !== 1) {
        return null;
    }
    const innerExprStmt = innerStmts[0];
    if (!ts.isExpressionStatement(innerExprStmt)) {
        return null;
    }
    return innerExprStmt.expression;
}
function isIvyPrivateCallExpression(expression, name) {
    // Now we're in the IIFE and have the inner expression statement. We can check if it matches
    // a private Ivy call.
    if (!ts.isCallExpression(expression)) {
        return false;
    }
    const propAccExpr = expression.expression;
    if (!ts.isPropertyAccessExpression(propAccExpr)) {
        return false;
    }
    if (propAccExpr.name.text !== name) {
        return false;
    }
    return true;
}
