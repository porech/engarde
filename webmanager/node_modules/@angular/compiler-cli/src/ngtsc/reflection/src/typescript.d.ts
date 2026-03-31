/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import ts from 'typescript';
import { ClassDeclaration, ClassMember, CtorParameter, Declaration, DeclarationNode, Decorator, FunctionDefinition, Import, ReflectionHost } from './host';
/**
 * reflector.ts implements static reflection of declarations using the TypeScript `ts.TypeChecker`.
 */
export declare class TypeScriptReflectionHost implements ReflectionHost {
    protected checker: ts.TypeChecker;
    private readonly isLocalCompilation;
    private readonly skipPrivateValueDeclarationTypes;
    /**
     * @param skipPrivateValueDeclarationTypes Avoids using a value declaration that is considered private (using a ɵ-prefix),
     * instead using the first available declaration. This is needed for the {@link FormControl} API of
     * which the type declaration documents the type and the value declaration corresponds with an implementation detail.
     */
    constructor(checker: ts.TypeChecker, isLocalCompilation?: boolean, skipPrivateValueDeclarationTypes?: boolean);
    getDecoratorsOfDeclaration(declaration: DeclarationNode): Decorator[] | null;
    getMembersOfClass(clazz: ClassDeclaration): ClassMember[];
    getConstructorParameters(clazz: ClassDeclaration): CtorParameter[] | null;
    getImportOfIdentifier(id: ts.Identifier): Import | null;
    getExportsOfModule(node: ts.Node): Map<string, Declaration> | null;
    isClass(node: ts.Node): node is ClassDeclaration;
    hasBaseClass(clazz: ClassDeclaration): boolean;
    getBaseClassExpression(clazz: ClassDeclaration): ts.Expression | null;
    getDeclarationOfIdentifier(id: ts.Identifier): Declaration | null;
    getDefinitionOfFunction(node: ts.Node): FunctionDefinition | null;
    getGenericArityOfClass(clazz: ClassDeclaration): number | null;
    getVariableValue(declaration: ts.VariableDeclaration): ts.Expression | null;
    isStaticallyExported(decl: ts.Node): boolean;
    protected getDirectImportOfIdentifier(id: ts.Identifier): Import | null;
    /**
     * Try to get the import info for this identifier as though it is a namespaced import.
     *
     * For example, if the identifier is the `Directive` part of a qualified type chain like:
     *
     * ```ts
     * core.Directive
     * ```
     *
     * then it might be that `core` is a namespace import such as:
     *
     * ```ts
     * import * as core from 'tslib';
     * ```
     *
     * @param id the TypeScript identifier to find the import info for.
     * @returns The import info if this is a namespaced import or `null`.
     */
    protected getImportOfNamespacedIdentifier(id: ts.Identifier, namespaceIdentifier: ts.Identifier | null): Import | null;
    /**
     * Resolve a `ts.Symbol` to its declaration, keeping track of the `viaModule` along the way.
     */
    protected getDeclarationOfSymbol(symbol: ts.Symbol, originalId: ts.Identifier | null): Declaration | null;
    private _reflectDecorator;
    /**
     * Get the set of declarations declared in `file` which are exported.
     */
    private getLocalExportedDeclarationsOfSourceFile;
    private _viaModule;
}
export declare function reflectNameOfDeclaration(decl: ts.Declaration): string | null;
export declare function reflectIdentifierOfDeclaration(decl: ts.Declaration): ts.Identifier | null;
export declare class TypeEntityToDeclarationError extends Error {
    constructor(message: string);
}
/**
 * @throws {TypeEntityToDeclarationError} if the type cannot be converted
 *   to a declaration.
 */
export declare function reflectTypeEntityToDeclaration(type: ts.EntityName, checker: ts.TypeChecker): {
    node: ts.Declaration;
    from: string | null;
};
export declare function filterToMembersWithDecorator(members: ClassMember[], name: string, module?: string): {
    member: ClassMember;
    decorators: Decorator[];
}[];
/**
 * Reflects a class element and returns static information about the
 * class member.
 *
 * Note: Decorator information is not included in this helper as it relies
 * on type checking to resolve originating import.
 */
export declare function reflectClassMember(node: ts.ClassElement): Omit<ClassMember, 'decorators'> | null;
export declare function findMember(members: ClassMember[], name: string, isStatic?: boolean): ClassMember | null;
export declare function reflectObjectLiteral(node: ts.ObjectLiteralExpression): Map<string, ts.Expression>;
/**
 * Gets the closest ancestor `ImportDeclaration` to a node.
 */
export declare function getContainingImportDeclaration(node: ts.Node): ts.ImportDeclaration | null;
