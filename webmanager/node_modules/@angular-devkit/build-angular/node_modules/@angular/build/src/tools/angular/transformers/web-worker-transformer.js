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
exports.createWorkerTransformer = createWorkerTransformer;
const typescript_1 = __importDefault(require("typescript"));
/**
 * Creates a TypeScript Transformer to process Worker and SharedWorker entry points and transform
 * the URL instances to reference the built and bundled worker code. This uses a callback process
 * similar to the component stylesheets to allow the main esbuild plugin to process files as needed.
 * Unsupported worker expressions will be left in their origin form.
 * @param getTypeChecker A function that returns a TypeScript TypeChecker instance for the program.
 * @returns A TypeScript transformer factory.
 */
function createWorkerTransformer(fileProcessor) {
    return (context) => {
        const nodeFactory = context.factory;
        const visitNode = (node) => {
            // Check if the node is a valid new expression for a Worker or SharedWorker
            // TODO: Add global scope check
            if (!typescript_1.default.isNewExpression(node) ||
                !typescript_1.default.isIdentifier(node.expression) ||
                (node.expression.text !== 'Worker' && node.expression.text !== 'SharedWorker')) {
                // Visit child nodes of non-Worker expressions
                return typescript_1.default.visitEachChild(node, visitNode, context);
            }
            // Worker should have atleast one argument but not more than two
            if (!node.arguments || node.arguments.length < 1 || node.arguments.length > 2) {
                return node;
            }
            // First argument must be a new URL expression
            const workerUrlNode = node.arguments[0];
            // TODO: Add global scope check
            if (!typescript_1.default.isNewExpression(workerUrlNode) ||
                !typescript_1.default.isIdentifier(workerUrlNode.expression) ||
                workerUrlNode.expression.text !== 'URL') {
                return node;
            }
            // URL must have 2 arguments
            if (!workerUrlNode.arguments || workerUrlNode.arguments.length !== 2) {
                return node;
            }
            // URL arguments must be a string and then `import.meta.url`
            if (!typescript_1.default.isStringLiteralLike(workerUrlNode.arguments[0]) ||
                !typescript_1.default.isPropertyAccessExpression(workerUrlNode.arguments[1]) ||
                !typescript_1.default.isMetaProperty(workerUrlNode.arguments[1].expression) ||
                workerUrlNode.arguments[1].name.text !== 'url') {
                return node;
            }
            const filePath = workerUrlNode.arguments[0].text;
            const importer = node.getSourceFile().fileName;
            // Process the file
            const replacementPath = fileProcessor(filePath, importer);
            // Update if the path changed
            if (replacementPath !== filePath) {
                return nodeFactory.updateNewExpression(node, node.expression, node.typeArguments, 
                // Update Worker arguments
                typescript_1.default.setTextRange(nodeFactory.createNodeArray([
                    nodeFactory.updateNewExpression(workerUrlNode, workerUrlNode.expression, workerUrlNode.typeArguments, 
                    // Update URL arguments
                    typescript_1.default.setTextRange(nodeFactory.createNodeArray([
                        nodeFactory.createStringLiteral(replacementPath),
                        workerUrlNode.arguments[1],
                    ], workerUrlNode.arguments.hasTrailingComma), workerUrlNode.arguments)),
                    // Use the second Worker argument (options) if present.
                    // Otherwise create a default options object for module Workers.
                    node.arguments[1] ??
                        nodeFactory.createObjectLiteralExpression([
                            nodeFactory.createPropertyAssignment('type', nodeFactory.createStringLiteral('module')),
                        ]),
                ], node.arguments.hasTrailingComma), node.arguments));
            }
            else {
                return node;
            }
        };
        return (sourceFile) => {
            // Skip transformer if there are no Workers
            if (!sourceFile.text.includes('Worker')) {
                return sourceFile;
            }
            return typescript_1.default.visitEachChild(sourceFile, visitNode, context);
        };
    };
}
