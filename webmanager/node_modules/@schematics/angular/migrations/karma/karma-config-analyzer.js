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
exports.analyzeKarmaConfig = analyzeKarmaConfig;
const typescript_1 = __importDefault(require("../../third_party/github.com/Microsoft/TypeScript/lib/typescript"));
function isRequireInfo(value) {
    return typeof value === 'object' && value !== null && !Array.isArray(value) && 'module' in value;
}
function isSupportedPropertyAssignment(prop) {
    return (typescript_1.default.isPropertyAssignment(prop) && (typescript_1.default.isIdentifier(prop.name) || typescript_1.default.isStringLiteral(prop.name)));
}
/**
 * Analyzes the content of a Karma configuration file to extract its settings.
 *
 * @param content The string content of the `karma.conf.js` file.
 * @returns An object containing the configuration settings and a flag indicating if unsupported values were found.
 */
function analyzeKarmaConfig(content) {
    const sourceFile = typescript_1.default.createSourceFile('karma.conf.js', content, typescript_1.default.ScriptTarget.Latest, true);
    const settings = new Map();
    let hasUnsupportedValues = false;
    function visit(node) {
        // The Karma configuration is defined within a `config.set({ ... })` call.
        if (typescript_1.default.isCallExpression(node) &&
            typescript_1.default.isPropertyAccessExpression(node.expression) &&
            node.expression.expression.getText(sourceFile) === 'config' &&
            node.expression.name.text === 'set' &&
            node.arguments.length === 1 &&
            typescript_1.default.isObjectLiteralExpression(node.arguments[0])) {
            // We found `config.set`, now we extract the properties from the object literal.
            for (const prop of node.arguments[0].properties) {
                if (isSupportedPropertyAssignment(prop)) {
                    const key = prop.name.text;
                    const value = extractValue(prop.initializer);
                    settings.set(key, value);
                }
                else {
                    hasUnsupportedValues = true;
                }
            }
        }
        else {
            typescript_1.default.forEachChild(node, visit);
        }
    }
    function extractValue(node) {
        switch (node.kind) {
            case typescript_1.default.SyntaxKind.StringLiteral:
                return node.text;
            case typescript_1.default.SyntaxKind.NumericLiteral:
                return Number(node.text);
            case typescript_1.default.SyntaxKind.TrueKeyword:
                return true;
            case typescript_1.default.SyntaxKind.FalseKeyword:
                return false;
            case typescript_1.default.SyntaxKind.Identifier: {
                const identifier = node.text;
                if (identifier === '__dirname' || identifier === '__filename') {
                    return identifier;
                }
                break;
            }
            case typescript_1.default.SyntaxKind.CallExpression: {
                const callExpr = node;
                // Handle require('...')
                if (typescript_1.default.isIdentifier(callExpr.expression) &&
                    callExpr.expression.text === 'require' &&
                    callExpr.arguments.length === 1 &&
                    typescript_1.default.isStringLiteral(callExpr.arguments[0])) {
                    return { module: callExpr.arguments[0].text };
                }
                // Handle calls on a require, e.g. require('path').join()
                const calleeValue = extractValue(callExpr.expression);
                if (isRequireInfo(calleeValue)) {
                    return {
                        ...calleeValue,
                        isCall: true,
                        arguments: callExpr.arguments.map(extractValue),
                    };
                }
                break;
            }
            case typescript_1.default.SyntaxKind.PropertyAccessExpression: {
                const propAccessExpr = node;
                // Handle config constants like `config.LOG_INFO`
                if (typescript_1.default.isIdentifier(propAccessExpr.expression) &&
                    propAccessExpr.expression.text === 'config') {
                    return `config.${propAccessExpr.name.text}`;
                }
                const value = extractValue(propAccessExpr.expression);
                if (isRequireInfo(value)) {
                    const currentExport = value.export
                        ? `${value.export}.${propAccessExpr.name.text}`
                        : propAccessExpr.name.text;
                    return { ...value, export: currentExport };
                }
                break;
            }
            case typescript_1.default.SyntaxKind.ArrayLiteralExpression:
                return node.elements.map(extractValue);
            case typescript_1.default.SyntaxKind.ObjectLiteralExpression: {
                const obj = {};
                for (const prop of node.properties) {
                    if (isSupportedPropertyAssignment(prop)) {
                        // Recursively extract values for nested objects.
                        obj[prop.name.text] = extractValue(prop.initializer);
                    }
                    else {
                        hasUnsupportedValues = true;
                    }
                }
                return obj;
            }
        }
        // For complex expressions (like variables) that we don't need to resolve,
        // we mark the analysis as potentially incomplete.
        hasUnsupportedValues = true;
        return undefined;
    }
    visit(sourceFile);
    return { settings, hasUnsupportedValues };
}
