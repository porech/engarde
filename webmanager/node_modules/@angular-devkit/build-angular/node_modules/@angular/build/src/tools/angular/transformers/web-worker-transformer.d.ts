/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import ts from 'typescript';
/**
 * Creates a TypeScript Transformer to process Worker and SharedWorker entry points and transform
 * the URL instances to reference the built and bundled worker code. This uses a callback process
 * similar to the component stylesheets to allow the main esbuild plugin to process files as needed.
 * Unsupported worker expressions will be left in their origin form.
 * @param getTypeChecker A function that returns a TypeScript TypeChecker instance for the program.
 * @returns A TypeScript transformer factory.
 */
export declare function createWorkerTransformer(fileProcessor: (file: string, importer: string) => string): ts.TransformerFactory<ts.SourceFile>;
