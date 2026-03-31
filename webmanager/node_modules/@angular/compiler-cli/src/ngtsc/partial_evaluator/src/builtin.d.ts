/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import ts from 'typescript';
import { KnownFn, ResolvedValue, ResolvedValueArray } from './result';
export declare class ArraySliceBuiltinFn extends KnownFn {
    private lhs;
    constructor(lhs: ResolvedValueArray);
    evaluate(node: ts.CallExpression, args: ResolvedValueArray): ResolvedValue;
}
export declare class ArrayConcatBuiltinFn extends KnownFn {
    private lhs;
    constructor(lhs: ResolvedValueArray);
    evaluate(node: ts.CallExpression, args: ResolvedValueArray): ResolvedValue;
}
export declare class StringConcatBuiltinFn extends KnownFn {
    private lhs;
    constructor(lhs: string);
    evaluate(node: ts.CallExpression, args: ResolvedValueArray): ResolvedValue;
}
