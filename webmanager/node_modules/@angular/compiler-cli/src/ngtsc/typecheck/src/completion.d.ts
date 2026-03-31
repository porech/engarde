/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import { AST, LiteralPrimitive, PropertyRead, SafePropertyRead, TmplAstNode, TmplAstTemplate, TmplAstTextAttribute } from '@angular/compiler';
import ts from 'typescript';
import { AbsoluteFsPath } from '../../file_system';
import { GlobalCompletion, TcbLocation } from '../api';
import { TypeCheckData } from './context';
/**
 * Powers autocompletion for a specific component.
 *
 * Internally caches autocompletion results, and must be discarded if the component template or
 * surrounding TS program have changed.
 */
export declare class CompletionEngine {
    private tcb;
    private data;
    private tcbPath;
    private tcbIsShim;
    private componentContext;
    /**
     * Get the `TcbLocation` for the global context, which is the location of the `this` variable.
     */
    private globalTsContext;
    /**
     * Cache of completions for various levels of the template, including the root template (`null`).
     * Memoizes `getTemplateContextCompletions`.
     */
    private templateContextCache;
    private expressionCompletionCache;
    constructor(tcb: ts.Node, data: TypeCheckData, tcbPath: AbsoluteFsPath, tcbIsShim: boolean);
    getGlobalTsContext(): TcbLocation | null;
    /**
     * Get global completions within the given template context and AST node.
     *
     * @param context the given template context - either a `TmplAstTemplate` embedded view, or `null`
     *     for the root
     * template context.
     * @param node the given AST node
     */
    getGlobalCompletions(context: TmplAstTemplate | null, node: AST | TmplAstNode): GlobalCompletion | null;
    getExpressionCompletionLocation(expr: PropertyRead | SafePropertyRead): TcbLocation | null;
    getLiteralCompletionLocation(expr: LiteralPrimitive | TmplAstTextAttribute): TcbLocation | null;
    /**
     * Get global completions within the given template context - either a `TmplAstTemplate` embedded
     * view, or `null` for the root context.
     */
    private getTemplateContextCompletions;
}
