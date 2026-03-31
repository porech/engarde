/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import ts from 'typescript';
/** Gets the string representation of a node's resolved type. */
export declare function extractResolvedTypeString(node: ts.Node, checker: ts.TypeChecker): string;
