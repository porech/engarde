/*!
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import ts from 'typescript';
/**
 * Creates a TypeScript node representing a numeric value.
 */
export declare function tsNumericExpression(value: number): ts.NumericLiteral | ts.PrefixUnaryExpression;
