/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import * as o from '@angular/compiler';
import { AstFactory } from './api/ast_factory';
import { ImportGenerator } from './api/import_generator';
import { Context } from './context';
export type RecordWrappedNodeFn<TExpression> = (node: o.WrappedNodeExpr<TExpression>) => void;
export interface TranslatorOptions<TExpression> {
    downlevelTaggedTemplates?: boolean;
    downlevelVariableDeclarations?: boolean;
    recordWrappedNode?: RecordWrappedNodeFn<TExpression>;
    annotateForClosureCompiler?: boolean;
}
export declare class ExpressionTranslatorVisitor<TFile, TStatement, TExpression> implements o.ExpressionVisitor, o.StatementVisitor {
    private factory;
    private imports;
    private contextFile;
    private downlevelTaggedTemplates;
    private downlevelVariableDeclarations;
    private recordWrappedNode;
    constructor(factory: AstFactory<TStatement, TExpression>, imports: ImportGenerator<TFile, TExpression>, contextFile: TFile, options: TranslatorOptions<TExpression>);
    visitDeclareVarStmt(stmt: o.DeclareVarStmt, context: Context): TStatement;
    visitDeclareFunctionStmt(stmt: o.DeclareFunctionStmt, context: Context): TStatement;
    visitExpressionStmt(stmt: o.ExpressionStatement, context: Context): TStatement;
    visitReturnStmt(stmt: o.ReturnStatement, context: Context): TStatement;
    visitIfStmt(stmt: o.IfStmt, context: Context): TStatement;
    visitReadVarExpr(ast: o.ReadVarExpr, _context: Context): TExpression;
    visitInvokeFunctionExpr(ast: o.InvokeFunctionExpr, context: Context): TExpression;
    visitTaggedTemplateLiteralExpr(ast: o.TaggedTemplateLiteralExpr, context: Context): TExpression;
    visitTemplateLiteralExpr(ast: o.TemplateLiteralExpr, context: Context): TExpression;
    visitInstantiateExpr(ast: o.InstantiateExpr, context: Context): TExpression;
    visitLiteralExpr(ast: o.LiteralExpr, _context: Context): TExpression;
    visitLocalizedString(ast: o.LocalizedString, context: Context): TExpression;
    private createTaggedTemplateExpression;
    /**
     * Translate the tagged template literal into a call that is compatible with ES5, using the
     * imported `__makeTemplateObject` helper for ES5 formatted output.
     */
    private createES5TaggedTemplateFunctionCall;
    visitExternalExpr(ast: o.ExternalExpr, _context: Context): TExpression;
    visitConditionalExpr(ast: o.ConditionalExpr, context: Context): TExpression;
    visitDynamicImportExpr(ast: o.DynamicImportExpr, context: any): TExpression;
    visitNotExpr(ast: o.NotExpr, context: Context): TExpression;
    visitFunctionExpr(ast: o.FunctionExpr, context: Context): TExpression;
    visitArrowFunctionExpr(ast: o.ArrowFunctionExpr, context: any): TExpression;
    visitBinaryOperatorExpr(ast: o.BinaryOperatorExpr, context: Context): TExpression;
    visitReadPropExpr(ast: o.ReadPropExpr, context: Context): TExpression;
    visitReadKeyExpr(ast: o.ReadKeyExpr, context: Context): TExpression;
    visitLiteralArrayExpr(ast: o.LiteralArrayExpr, context: Context): TExpression;
    visitLiteralMapExpr(ast: o.LiteralMapExpr, context: Context): TExpression;
    visitCommaExpr(ast: o.CommaExpr, context: Context): never;
    visitTemplateLiteralElementExpr(ast: o.TemplateLiteralElementExpr, context: any): void;
    visitWrappedNodeExpr(ast: o.WrappedNodeExpr<any>, _context: Context): any;
    visitTypeofExpr(ast: o.TypeofExpr, context: Context): TExpression;
    visitVoidExpr(ast: o.VoidExpr, context: Context): TExpression;
    visitUnaryOperatorExpr(ast: o.UnaryOperatorExpr, context: Context): TExpression;
    visitParenthesizedExpr(ast: o.ParenthesizedExpr, context: any): TExpression;
    private visitStatements;
    private setSourceMapRange;
    private attachComments;
    private getTemplateLiteralFromAst;
}
