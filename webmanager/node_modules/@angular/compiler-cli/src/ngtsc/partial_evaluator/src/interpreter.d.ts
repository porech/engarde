/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import ts from 'typescript';
import { DependencyTracker } from '../../incremental/api';
import { ReflectionHost } from '../../reflection';
import type { ForeignFunctionResolver } from './interface';
import { ResolvedValue } from './result';
/**
 * Tracks the scope of a function body, which includes `ResolvedValue`s for the parameters of that
 * body.
 */
type Scope = Map<ts.ParameterDeclaration, ResolvedValue>;
interface Context {
    originatingFile: ts.SourceFile;
    /**
     * The module name (if any) which was used to reach the currently resolving
     * symbols.
     */
    absoluteModuleName: string | null;
    /**
     * A file name representing the context in which the current
     * `absoluteModuleName`, if any, was resolved.
     */
    resolutionContext: string;
    scope: Scope;
    foreignFunctionResolver?: ForeignFunctionResolver;
}
export declare class StaticInterpreter {
    private host;
    private checker;
    private dependencyTracker;
    private readonly BINARY_OPERATORS;
    private readonly UNARY_OPERATORS;
    constructor(host: ReflectionHost, checker: ts.TypeChecker, dependencyTracker: DependencyTracker | null);
    visit(node: ts.Expression, context: Context): ResolvedValue;
    private visitExpression;
    private visitArrayLiteralExpression;
    protected visitObjectLiteralExpression(node: ts.ObjectLiteralExpression, context: Context): ResolvedValue;
    private visitTemplateExpression;
    private visitIdentifier;
    private visitDeclaration;
    private visitVariableDeclaration;
    private visitEnumDeclaration;
    private visitElementAccessExpression;
    private visitPropertyAccessExpression;
    private visitSourceFile;
    private accessHelper;
    private visitCallExpression;
    /**
     * Visit an expression which was extracted from a foreign-function resolver.
     *
     * This will process the result and ensure it's correct for FFR-resolved values, including marking
     * `Reference`s as synthetic.
     */
    private visitFfrExpression;
    private visitFunctionBody;
    private visitConditionalExpression;
    private visitPrefixUnaryExpression;
    private visitBinaryExpression;
    private visitParenthesizedExpression;
    private evaluateFunctionArguments;
    private visitSpreadElement;
    private visitBindingElement;
    private stringNameFromPropertyName;
    private getReference;
    private visitType;
    private visitTupleType;
    private visitTypeQuery;
}
export {};
