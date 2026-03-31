/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import ts from 'typescript';
import { EntryType, FunctionEntry, ParameterEntry } from './entities';
export type FunctionLike = ts.FunctionDeclaration | ts.MethodDeclaration | ts.MethodSignature | ts.CallSignatureDeclaration | ts.ConstructSignatureDeclaration | ts.ConstructorDeclaration;
export declare class FunctionExtractor {
    private name;
    private exportDeclaration;
    private typeChecker;
    constructor(name: string, exportDeclaration: FunctionLike, typeChecker: ts.TypeChecker);
    extract(): FunctionEntry;
}
/** Extracts parameters of the given parameter declaration AST nodes. */
export declare function extractAllParams(params: ts.NodeArray<ts.ParameterDeclaration>, typeChecker: ts.TypeChecker): ParameterEntry[];
export declare function extractCallSignatures(name: string, typeChecker: ts.TypeChecker, type: ts.Type): {
    name: string;
    entryType: EntryType;
    description: string;
    generics: import("./entities").GenericEntry[];
    isNewType: boolean;
    jsdocTags: import("./entities").JsDocTagEntry[];
    params: ParameterEntry[];
    rawComment: string;
    returnType: string;
}[];
/** Finds the implementation of the given function declaration overload signature. */
export declare function findImplementationOfFunction(node: FunctionLike, typeChecker: ts.TypeChecker): FunctionLike | undefined;
