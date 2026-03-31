/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import ts from 'typescript';
import { AstFactory, BinaryOperator, LeadingComment, ObjectLiteralProperty, SourceMapRange, TemplateLiteral, UnaryOperator, VariableDeclarationType } from './api/ast_factory';
/**
 * A TypeScript flavoured implementation of the AstFactory.
 */
export declare class TypeScriptAstFactory implements AstFactory<ts.Statement, ts.Expression> {
    private annotateForClosureCompiler;
    private externalSourceFiles;
    private readonly UNARY_OPERATORS;
    private readonly BINARY_OPERATORS;
    private readonly VAR_TYPES;
    constructor(annotateForClosureCompiler: boolean);
    attachComments: typeof attachComments;
    createArrayLiteral: (elements?: readonly ts.Expression[], multiLine?: boolean) => ts.ArrayLiteralExpression;
    createAssignment(target: ts.Expression, operator: BinaryOperator, value: ts.Expression): ts.Expression;
    createBinaryExpression(leftOperand: ts.Expression, operator: BinaryOperator, rightOperand: ts.Expression): ts.Expression;
    createBlock(body: ts.Statement[]): ts.Statement;
    createCallExpression(callee: ts.Expression, args: ts.Expression[], pure: boolean): ts.Expression;
    createConditional(condition: ts.Expression, whenTrue: ts.Expression, whenFalse: ts.Expression): ts.Expression;
    createElementAccess: (expression: ts.Expression, index: number | ts.Expression) => ts.ElementAccessExpression;
    createExpressionStatement: (expression: ts.Expression) => ts.ExpressionStatement;
    createDynamicImport(url: string | ts.Expression): ts.CallExpression;
    createFunctionDeclaration(functionName: string, parameters: string[], body: ts.Statement): ts.Statement;
    createFunctionExpression(functionName: string | null, parameters: string[], body: ts.Statement): ts.Expression;
    createArrowFunctionExpression(parameters: string[], body: ts.Statement | ts.Expression): ts.Expression;
    createIdentifier: (text: string) => ts.Identifier;
    createIfStatement(condition: ts.Expression, thenStatement: ts.Statement, elseStatement: ts.Statement | null): ts.Statement;
    createLiteral(value: string | number | boolean | null | undefined): ts.Expression;
    createNewExpression(expression: ts.Expression, args: ts.Expression[]): ts.Expression;
    createObjectLiteral(properties: ObjectLiteralProperty<ts.Expression>[]): ts.Expression;
    createParenthesizedExpression: (expression: ts.Expression) => ts.ParenthesizedExpression;
    createPropertyAccess: (expression: ts.Expression, name: string | ts.MemberName) => ts.PropertyAccessExpression;
    createReturnStatement(expression: ts.Expression | null): ts.Statement;
    createTaggedTemplate(tag: ts.Expression, template: TemplateLiteral<ts.Expression>): ts.Expression;
    createTemplateLiteral(template: TemplateLiteral<ts.Expression>): ts.TemplateLiteral;
    createThrowStatement: (expression: ts.Expression) => ts.ThrowStatement;
    createTypeOfExpression: (expression: ts.Expression) => ts.TypeOfExpression;
    createVoidExpression: (expression: ts.Expression) => ts.VoidExpression;
    createUnaryExpression(operator: UnaryOperator, operand: ts.Expression): ts.Expression;
    createVariableDeclaration(variableName: string, initializer: ts.Expression | null, type: VariableDeclarationType): ts.Statement;
    setSourceMapRange<T extends ts.Node>(node: T, sourceMapRange: SourceMapRange | null): T;
}
export declare function createTemplateMiddle(cooked: string, raw: string): ts.TemplateMiddle;
export declare function createTemplateTail(cooked: string, raw: string): ts.TemplateTail;
/**
 * Attach the given `leadingComments` to the `statement` node.
 *
 * @param statement The statement that will have comments attached.
 * @param leadingComments The comments to attach to the statement.
 */
export declare function attachComments(statement: ts.Statement | ts.Expression, leadingComments: LeadingComment[]): void;
