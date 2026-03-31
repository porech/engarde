/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import ts from 'typescript';
export declare function tsCastToAny(expr: ts.Expression): ts.Expression;
/**
 * Create an expression which instantiates an element by its HTML tagName.
 *
 * Thanks to narrowing of `document.createElement()`, this expression will have its type inferred
 * based on the tag name, including for custom elements that have appropriate .d.ts definitions.
 */
export declare function tsCreateElement(...tagNames: string[]): ts.Expression;
/**
 * Create a `ts.VariableStatement` which declares a variable without explicit initialization.
 *
 * The initializer `null!` is used to bypass strict variable initialization checks.
 *
 * Unlike with `tsCreateVariable`, the type of the variable is explicitly specified.
 */
export declare function tsDeclareVariable(id: ts.Identifier, type: ts.TypeNode): ts.VariableStatement;
/**
 * Creates a `ts.TypeQueryNode` for a coerced input.
 *
 * For example: `typeof MatInput.ngAcceptInputType_value`, where MatInput is `typeName` and `value`
 * is the `coercedInputName`.
 *
 * @param typeName The `EntityName` of the Directive where the static coerced input is defined.
 * @param coercedInputName The field name of the coerced input.
 */
export declare function tsCreateTypeQueryForCoercedInput(typeName: ts.EntityName, coercedInputName: string): ts.TypeQueryNode;
/**
 * Create a `ts.VariableStatement` that initializes a variable with a given expression.
 *
 * Unlike with `tsDeclareVariable`, the type of the variable is inferred from the initializer
 * expression.
 */
export declare function tsCreateVariable(id: ts.Identifier, initializer: ts.Expression, flags?: ts.NodeFlags | null): ts.VariableStatement;
/**
 * Construct a `ts.CallExpression` that calls a method on a receiver.
 */
export declare function tsCallMethod(receiver: ts.Expression, methodName: string, args?: ts.Expression[]): ts.CallExpression;
export declare function isAccessExpression(node: ts.Node): node is ts.ElementAccessExpression | ts.PropertyAccessExpression;
/**
 * Creates a TypeScript node representing a numeric value.
 */
export declare function tsNumericExpression(value: number): ts.NumericLiteral | ts.PrefixUnaryExpression;
/**
 * Check if a node represents a directive declaration in a TypeCheck Block.
 * Directive declarations can be either:
 * - var _t1: TestDir /*T:D*\/ = null! as TestDir;
 * - var _t1 /*T:D*\/ = _ctor1({});
 */
export declare function isDirectiveDeclaration(node: ts.Node): node is ts.TypeNode | ts.Identifier;
/**
 * Check if the lastSymbol is an alias of the firstSymbol. For example:
 *
 * The NewBarComponent is an alias of BarComponent.
 *
 * But the NotAliasBarComponent is not an alias of BarComponent, because
 * the NotAliasBarComponent is a new variable.
 *
 * This should work for most cases.
 *
 * https://github.com/microsoft/TypeScript/blob/9e20e032effad965567d4a1e1c30d5433b0a3332/src/compiler/checker.ts#L3638-L3652
 *
 * ```
 * // a.ts
 * export class BarComponent {};
 * // b.ts
 * export {BarComponent as NewBarComponent} from "./a";
 * // c.ts
 * import {BarComponent} from "./a"
 * const NotAliasBarComponent = BarComponent;
 * export {NotAliasBarComponent};
 * ```
 */
export declare function isSymbolAliasOf(firstSymbol: ts.Symbol, lastSymbol: ts.Symbol, typeChecker: ts.TypeChecker): boolean;
