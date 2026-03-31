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
exports.findImageDomains = findImageDomains;
const typescript_1 = __importDefault(require("typescript"));
const BUILTIN_LOADERS = new Set([
    'provideCloudflareLoader',
    'provideCloudinaryLoader',
    'provideImageKitLoader',
    'provideImgixLoader',
]);
const URL_REGEX = /(https?:\/\/[^/]*)\//g;
function findImageDomains(imageDomains) {
    return (context) => {
        return (sourceFile) => {
            const isBuiltinImageLoader = (node) => {
                return BUILTIN_LOADERS.has(node.expression.getText());
            };
            const findDomainString = (node) => {
                if (typescript_1.default.isStringLiteral(node) ||
                    typescript_1.default.isTemplateHead(node) ||
                    typescript_1.default.isTemplateMiddle(node) ||
                    typescript_1.default.isTemplateTail(node)) {
                    const domain = node.text.match(URL_REGEX);
                    if (domain && domain[0]) {
                        imageDomains.add(domain[0]);
                        return node;
                    }
                }
                typescript_1.default.visitEachChild(node, findDomainString, context);
                return node;
            };
            function isImageProviderKey(property) {
                return (typescript_1.default.isPropertyAssignment(property) &&
                    property.name.getText() === 'provide' &&
                    property.initializer.getText() === 'IMAGE_LOADER');
            }
            function isImageProviderValue(property) {
                return typescript_1.default.isPropertyAssignment(property) && property.name.getText() === 'useValue';
            }
            function checkForDomain(node) {
                if (node.properties.find(isImageProviderKey)) {
                    const value = node.properties.find(isImageProviderValue);
                    if (value && typescript_1.default.isPropertyAssignment(value)) {
                        if (typescript_1.default.isArrowFunction(value.initializer) ||
                            typescript_1.default.isFunctionExpression(value.initializer)) {
                            typescript_1.default.visitEachChild(node, findDomainString, context);
                        }
                    }
                }
            }
            function findImageLoaders(node) {
                if (typescript_1.default.isCallExpression(node)) {
                    if (isBuiltinImageLoader(node)) {
                        const firstArg = node.arguments[0];
                        if (typescript_1.default.isStringLiteralLike(firstArg)) {
                            imageDomains.add(firstArg.text);
                        }
                    }
                }
                else if (typescript_1.default.isObjectLiteralExpression(node)) {
                    checkForDomain(node);
                }
                return node;
            }
            function findProvidersAssignment(node) {
                if (typescript_1.default.isPropertyAssignment(node)) {
                    if (typescript_1.default.isIdentifier(node.name) && node.name.escapedText === 'providers') {
                        typescript_1.default.visitEachChild(node.initializer, findImageLoaders, context);
                    }
                }
                return node;
            }
            function findFeaturesAssignment(node) {
                if (typescript_1.default.isPropertyAssignment(node)) {
                    if (typescript_1.default.isIdentifier(node.name) &&
                        node.name.escapedText === 'features' &&
                        typescript_1.default.isArrayLiteralExpression(node.initializer)) {
                        const providerElement = node.initializer.elements.find(isProvidersFeatureElement);
                        if (providerElement &&
                            typescript_1.default.isCallExpression(providerElement) &&
                            providerElement.arguments[0]) {
                            typescript_1.default.visitEachChild(providerElement.arguments[0], findImageLoaders, context);
                        }
                    }
                }
                return node;
            }
            function isProvidersFeatureElement(node) {
                return (typescript_1.default.isCallExpression(node) &&
                    typescript_1.default.isPropertyAccessExpression(node.expression) &&
                    typescript_1.default.isIdentifier(node.expression.expression) &&
                    node.expression.expression.escapedText === 'i0' &&
                    typescript_1.default.isIdentifier(node.expression.name) &&
                    node.expression.name.escapedText === 'ɵɵProvidersFeature');
            }
            function findPropertyDeclaration(node) {
                if (typescript_1.default.isPropertyDeclaration(node) &&
                    typescript_1.default.isIdentifier(node.name) &&
                    node.initializer &&
                    typescript_1.default.isCallExpression(node.initializer) &&
                    node.initializer.arguments[0]) {
                    if (node.name.escapedText === 'ɵinj') {
                        typescript_1.default.visitEachChild(node.initializer.arguments[0], findProvidersAssignment, context);
                    }
                    else if (node.name.escapedText === 'ɵcmp') {
                        typescript_1.default.visitEachChild(node.initializer.arguments[0], findFeaturesAssignment, context);
                    }
                }
                return node;
            }
            function findClassDeclaration(node) {
                if (typescript_1.default.isClassDeclaration(node)) {
                    typescript_1.default.visitEachChild(node, findPropertyDeclaration, context);
                }
                return node;
            }
            typescript_1.default.visitEachChild(sourceFile, findClassDeclaration, context);
            return sourceFile;
        };
    };
}
