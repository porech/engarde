/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import ts from 'typescript';
import { Reference } from '../../imports';
import { DependencyTracker } from '../../incremental/api';
import { ReflectionHost } from '../../reflection';
import { DynamicValue } from './dynamic';
import { ResolvedValue } from './result';
export type ForeignFunctionResolver = (fn: Reference<ts.FunctionDeclaration | ts.MethodDeclaration | ts.FunctionExpression>, callExpr: ts.CallExpression, resolve: (expr: ts.Expression) => ResolvedValue, unresolvable: DynamicValue) => ResolvedValue;
export declare class PartialEvaluator {
    private host;
    private checker;
    private dependencyTracker;
    constructor(host: ReflectionHost, checker: ts.TypeChecker, dependencyTracker: DependencyTracker | null);
    evaluate(expr: ts.Expression, foreignFunctionResolver?: ForeignFunctionResolver): ResolvedValue;
}
