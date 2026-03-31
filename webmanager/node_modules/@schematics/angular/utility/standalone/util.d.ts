/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import { Tree } from '@angular-devkit/schematics';
import ts from '../../third_party/github.com/Microsoft/TypeScript/lib/typescript';
import { Change } from '../change';
/**
 * Finds the main file of a project.
 * @param tree File tree for the project.
 * @param projectName Name of the project in which to search.
 */
export declare function getMainFilePath(tree: Tree, projectName: string): Promise<string>;
/**
 * Gets a TypeScript source file at a specific path.
 * @param tree File tree of a project.
 * @param path Path to the file.
 */
export declare function getSourceFile(tree: Tree, path: string): ts.SourceFile;
/** Finds the call to `bootstrapApplication` within a file. */
export declare function findBootstrapApplicationCall(tree: Tree, mainFilePath: string): ts.CallExpression;
/**
 * Applies a set of changes to a file.
 * @param tree File tree of the project.
 * @param path Path to the file that is being changed.
 * @param changes Changes that should be applied to the file.
 */
export declare function applyChangesToFile(tree: Tree, path: string, changes: Change[]): void;
/** Checks whether a node is a call to `mergeApplicationConfig`. */
export declare function isMergeAppConfigCall(node: ts.Node): node is ts.CallExpression;
/** Finds the `providers` array literal within an application config. */
export declare function findProvidersLiteral(config: ts.ObjectLiteralExpression): ts.ArrayLiteralExpression | null;
