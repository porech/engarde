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
exports.lazyRoutesTransformer = lazyRoutesTransformer;
const node_assert_1 = __importDefault(require("node:assert"));
const posix_1 = require("node:path/posix");
const typescript_1 = __importDefault(require("typescript"));
/**
 * A transformer factory that adds a property to the lazy-loaded route object.
 * This property is used to allow for the retrieval of the module path during SSR.
 *
 * @param compilerOptions The compiler options.
 * @param compilerHost The compiler host.
 * @returns A transformer factory.
 *
 * @example
 * **Before:**
 * ```ts
 * const routes: Routes = [
 *   {
 *     path: 'lazy',
 *     loadChildren: () => import('./lazy/lazy.module').then(m => m.LazyModule)
 *   }
 * ];
 * ```
 *
 * **After:**
 * ```ts
 * const routes: Routes = [
 *   {
 *     path: 'lazy',
 *     loadChildren: () => import('./lazy/lazy.module').then(m => m.LazyModule),
 *     ...(typeof ngServerMode !== "undefined" && ngServerMode ? { ɵentryName: "./lazy/lazy.module.ts" }: {})
 *   }
 * ];
 * ```
 */
function lazyRoutesTransformer(compilerOptions, compilerHost) {
    const moduleResolutionCache = compilerHost.getModuleResolutionCache?.();
    (0, node_assert_1.default)(typeof compilerOptions.basePath === 'string', 'compilerOptions.basePath should be a string.');
    const basePath = compilerOptions.basePath;
    return (context) => {
        const factory = context.factory;
        const visitor = (node) => {
            if (!typescript_1.default.isObjectLiteralExpression(node)) {
                // Not an object literal, so skip it.
                return typescript_1.default.visitEachChild(node, visitor, context);
            }
            const loadFunction = getLoadComponentOrChildrenProperty(node)?.initializer;
            // Check if the initializer is an arrow function or a function expression
            if (!loadFunction ||
                (!typescript_1.default.isArrowFunction(loadFunction) && !typescript_1.default.isFunctionExpression(loadFunction))) {
                return typescript_1.default.visitEachChild(node, visitor, context);
            }
            let callExpression;
            if (typescript_1.default.isArrowFunction(loadFunction)) {
                // Handle arrow functions: body can either be a block or a direct call expression
                const body = loadFunction.body;
                if (typescript_1.default.isBlock(body)) {
                    // Arrow function with a block: check the first statement for a return call expression
                    const firstStatement = body.statements[0];
                    if (firstStatement &&
                        typescript_1.default.isReturnStatement(firstStatement) &&
                        firstStatement.expression &&
                        typescript_1.default.isCallExpression(firstStatement.expression)) {
                        callExpression = firstStatement.expression;
                    }
                }
                else if (typescript_1.default.isCallExpression(body)) {
                    // Arrow function with a direct call expression as its body
                    callExpression = body;
                }
            }
            else if (typescript_1.default.isFunctionExpression(loadFunction)) {
                // Handle function expressions: check for a return statement with a call expression
                const returnExpression = loadFunction.body.statements.find(typescript_1.default.isReturnStatement)?.expression;
                if (returnExpression && typescript_1.default.isCallExpression(returnExpression)) {
                    callExpression = returnExpression;
                }
            }
            if (!callExpression) {
                return typescript_1.default.visitEachChild(node, visitor, context);
            }
            // Optionally check for the 'then' property access expression
            const expression = callExpression.expression;
            if (!typescript_1.default.isCallExpression(expression) &&
                typescript_1.default.isPropertyAccessExpression(expression) &&
                expression.name.text !== 'then') {
                return typescript_1.default.visitEachChild(node, visitor, context);
            }
            const importExpression = typescript_1.default.isPropertyAccessExpression(expression)
                ? expression.expression // Navigate to the underlying expression for 'then'
                : callExpression;
            // Ensure the underlying expression is an import call
            if (!typescript_1.default.isCallExpression(importExpression) ||
                importExpression.expression.kind !== typescript_1.default.SyntaxKind.ImportKeyword) {
                return typescript_1.default.visitEachChild(node, visitor, context);
            }
            // Check if the argument to the import call is a string literal
            const callExpressionArgument = importExpression.arguments[0];
            if (!typescript_1.default.isStringLiteralLike(callExpressionArgument)) {
                // Not a string literal, so skip it.
                return typescript_1.default.visitEachChild(node, visitor, context);
            }
            const resolvedPath = typescript_1.default.resolveModuleName(callExpressionArgument.text, node.getSourceFile().fileName, compilerOptions, compilerHost, moduleResolutionCache)?.resolvedModule?.resolvedFileName;
            if (!resolvedPath) {
                // Could not resolve the module, so skip it.
                return typescript_1.default.visitEachChild(node, visitor, context);
            }
            const resolvedRelativePath = (0, posix_1.relative)(basePath, resolvedPath);
            // Create the new property
            // Example: `...(typeof ngServerMode !== "undefined" && ngServerMode ? { ɵentryName: "src/home.ts" }: {})`
            const newProperty = factory.createSpreadAssignment(factory.createParenthesizedExpression(factory.createConditionalExpression(factory.createBinaryExpression(factory.createBinaryExpression(factory.createTypeOfExpression(factory.createIdentifier('ngServerMode')), factory.createToken(typescript_1.default.SyntaxKind.ExclamationEqualsEqualsToken), factory.createStringLiteral('undefined')), factory.createToken(typescript_1.default.SyntaxKind.AmpersandAmpersandToken), factory.createIdentifier('ngServerMode')), factory.createToken(typescript_1.default.SyntaxKind.QuestionToken), factory.createObjectLiteralExpression([
                factory.createPropertyAssignment(factory.createIdentifier('ɵentryName'), factory.createStringLiteral(resolvedRelativePath)),
            ]), factory.createToken(typescript_1.default.SyntaxKind.ColonToken), factory.createObjectLiteralExpression([]))));
            // Add the new property to the object literal.
            return factory.updateObjectLiteralExpression(node, [...node.properties, newProperty]);
        };
        return (sourceFile) => {
            const text = sourceFile.text;
            if (!text.includes('loadC')) {
                // Fast check for 'loadComponent' and 'loadChildren'.
                return sourceFile;
            }
            return typescript_1.default.visitEachChild(sourceFile, visitor, context);
        };
    };
}
/**
 * Retrieves the property assignment for the `loadComponent` or `loadChildren` property of a route object.
 *
 * @param node The object literal expression to search.
 * @returns The property assignment if found, otherwise `undefined`.
 */
function getLoadComponentOrChildrenProperty(node) {
    let hasPathProperty = false;
    let loadComponentOrChildrenProperty;
    for (const prop of node.properties) {
        if (!typescript_1.default.isPropertyAssignment(prop) || !typescript_1.default.isIdentifier(prop.name)) {
            continue;
        }
        const propertyNameText = prop.name.text;
        if (propertyNameText === 'path') {
            hasPathProperty = true;
        }
        else if (propertyNameText === 'loadComponent' || propertyNameText === 'loadChildren') {
            loadComponentOrChildrenProperty = prop;
        }
        if (hasPathProperty && loadComponentOrChildrenProperty) {
            break;
        }
    }
    return loadComponentOrChildrenProperty;
}
