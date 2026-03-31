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
exports.createJitResourceTransformer = createJitResourceTransformer;
const typescript_1 = __importDefault(require("typescript"));
const uri_1 = require("../uri");
/**
 * Creates a TypeScript Transformer to transform Angular Component resource references into
 * static import statements. This transformer is used in Angular's JIT compilation mode to
 * support processing of component resources. When in AOT mode, the Angular AOT compiler handles
 * this processing and this transformer is not used.
 * @param getTypeChecker A function that returns a TypeScript TypeChecker instance for the program.
 * @returns A TypeScript transformer factory.
 */
function createJitResourceTransformer(getTypeChecker) {
    return (context) => {
        const typeChecker = getTypeChecker();
        const nodeFactory = context.factory;
        const resourceImportDeclarations = [];
        const visitNode = (node) => {
            if (typescript_1.default.isClassDeclaration(node)) {
                const decorators = typescript_1.default.getDecorators(node);
                if (!decorators || decorators.length === 0) {
                    return node;
                }
                return nodeFactory.updateClassDeclaration(node, [
                    ...decorators.map((current) => visitDecorator(nodeFactory, current, typeChecker, resourceImportDeclarations)),
                    ...(typescript_1.default.getModifiers(node) ?? []),
                ], node.name, node.typeParameters, node.heritageClauses, node.members);
            }
            return typescript_1.default.visitEachChild(node, visitNode, context);
        };
        return (sourceFile) => {
            const updatedSourceFile = typescript_1.default.visitEachChild(sourceFile, visitNode, context);
            if (resourceImportDeclarations.length > 0) {
                return nodeFactory.updateSourceFile(updatedSourceFile, typescript_1.default.setTextRange(nodeFactory.createNodeArray([...resourceImportDeclarations, ...updatedSourceFile.statements], updatedSourceFile.statements.hasTrailingComma), updatedSourceFile.statements), updatedSourceFile.isDeclarationFile, updatedSourceFile.referencedFiles, updatedSourceFile.typeReferenceDirectives, updatedSourceFile.hasNoDefaultLib, updatedSourceFile.libReferenceDirectives);
            }
            else {
                return updatedSourceFile;
            }
        };
    };
}
function visitDecorator(nodeFactory, node, typeChecker, resourceImportDeclarations) {
    const origin = getDecoratorOrigin(node, typeChecker);
    if (!origin || origin.module !== '@angular/core' || origin.name !== 'Component') {
        return node;
    }
    if (!typescript_1.default.isCallExpression(node.expression)) {
        return node;
    }
    const decoratorFactory = node.expression;
    const args = decoratorFactory.arguments;
    if (args.length !== 1 || !typescript_1.default.isObjectLiteralExpression(args[0])) {
        // Unsupported component metadata
        return node;
    }
    const objectExpression = args[0];
    const styleReplacements = [];
    // visit all properties
    let properties = typescript_1.default.visitNodes(objectExpression.properties, (node) => typescript_1.default.isObjectLiteralElementLike(node)
        ? visitComponentMetadata(nodeFactory, node, styleReplacements, resourceImportDeclarations)
        : node);
    // replace properties with updated properties
    if (styleReplacements.length > 0) {
        const styleProperty = nodeFactory.createPropertyAssignment(nodeFactory.createIdentifier('styles'), nodeFactory.createArrayLiteralExpression(styleReplacements));
        properties = nodeFactory.createNodeArray([...properties, styleProperty]);
    }
    return nodeFactory.updateDecorator(node, nodeFactory.updateCallExpression(decoratorFactory, decoratorFactory.expression, decoratorFactory.typeArguments, [nodeFactory.updateObjectLiteralExpression(objectExpression, properties)]));
}
function visitComponentMetadata(nodeFactory, node, styleReplacements, resourceImportDeclarations) {
    if (!typescript_1.default.isPropertyAssignment(node) || typescript_1.default.isComputedPropertyName(node.name)) {
        return node;
    }
    switch (node.name.text) {
        case 'templateUrl':
            // Only analyze string literals
            if (!typescript_1.default.isStringLiteralLike(node.initializer)) {
                return node;
            }
            return node.initializer.text.length === 0
                ? node
                : nodeFactory.updatePropertyAssignment(node, nodeFactory.createIdentifier('template'), createResourceImport(nodeFactory, (0, uri_1.generateJitFileUri)(node.initializer.text, 'template'), resourceImportDeclarations));
        case 'styles':
            if (typescript_1.default.isStringLiteralLike(node.initializer)) {
                styleReplacements.unshift(createResourceImport(nodeFactory, (0, uri_1.generateJitInlineUri)(node.initializer.text, 'style'), resourceImportDeclarations));
                return undefined;
            }
            if (typescript_1.default.isArrayLiteralExpression(node.initializer)) {
                const inlineStyles = typescript_1.default.visitNodes(node.initializer.elements, (node) => {
                    if (!typescript_1.default.isStringLiteralLike(node)) {
                        return node;
                    }
                    return node.text.length === 0
                        ? undefined // An empty inline style is equivalent to not having a style element
                        : createResourceImport(nodeFactory, (0, uri_1.generateJitInlineUri)(node.text, 'style'), resourceImportDeclarations);
                });
                // Inline styles should be placed first
                styleReplacements.unshift(...inlineStyles);
                // The inline styles will be added afterwards in combination with any external styles
                return undefined;
            }
            return node;
        case 'styleUrl':
            if (typescript_1.default.isStringLiteralLike(node.initializer)) {
                styleReplacements.push(createResourceImport(nodeFactory, (0, uri_1.generateJitFileUri)(node.initializer.text, 'style'), resourceImportDeclarations));
                return undefined;
            }
            return node;
        case 'styleUrls': {
            if (!typescript_1.default.isArrayLiteralExpression(node.initializer)) {
                return node;
            }
            const externalStyles = typescript_1.default.visitNodes(node.initializer.elements, (node) => {
                if (!typescript_1.default.isStringLiteralLike(node)) {
                    return node;
                }
                return node.text
                    ? createResourceImport(nodeFactory, (0, uri_1.generateJitFileUri)(node.text, 'style'), resourceImportDeclarations)
                    : undefined;
            });
            // External styles are applied after any inline styles
            styleReplacements.push(...externalStyles);
            // The external styles will be added afterwards in combination with any inline styles
            return undefined;
        }
        default:
            // All other elements are passed through
            return node;
    }
}
function createResourceImport(nodeFactory, url, resourceImportDeclarations) {
    const urlLiteral = nodeFactory.createStringLiteral(url);
    const importName = nodeFactory.createIdentifier(`__NG_CLI_RESOURCE__${resourceImportDeclarations.length}`);
    resourceImportDeclarations.push(nodeFactory.createImportDeclaration(undefined, nodeFactory.createImportClause(false, importName, undefined), urlLiteral));
    return importName;
}
function getDecoratorOrigin(decorator, typeChecker) {
    if (!typescript_1.default.isCallExpression(decorator.expression)) {
        return null;
    }
    let identifier;
    let name = '';
    if (typescript_1.default.isPropertyAccessExpression(decorator.expression.expression)) {
        identifier = decorator.expression.expression.expression;
        name = decorator.expression.expression.name.text;
    }
    else if (typescript_1.default.isIdentifier(decorator.expression.expression)) {
        identifier = decorator.expression.expression;
    }
    else {
        return null;
    }
    // NOTE: resolver.getReferencedImportDeclaration would work as well but is internal
    const symbol = typeChecker.getSymbolAtLocation(identifier);
    if (symbol && symbol.declarations && symbol.declarations.length > 0) {
        const declaration = symbol.declarations[0];
        let module;
        if (typescript_1.default.isImportSpecifier(declaration)) {
            name = (declaration.propertyName || declaration.name).text;
            module = declaration.parent.parent.parent.moduleSpecifier.text;
        }
        else if (typescript_1.default.isNamespaceImport(declaration)) {
            // Use the name from the decorator namespace property access
            module = declaration.parent.parent.moduleSpecifier.text;
        }
        else if (typescript_1.default.isImportClause(declaration)) {
            name = declaration.name.text;
            module = declaration.parent.moduleSpecifier.text;
        }
        else {
            return null;
        }
        return { name, module };
    }
    return null;
}
