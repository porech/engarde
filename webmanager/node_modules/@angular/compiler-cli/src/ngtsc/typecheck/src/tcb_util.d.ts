/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import { AbsoluteSourceSpan, ParseSourceSpan } from '@angular/compiler';
import ts from 'typescript';
import { ClassDeclaration, ReflectionHost } from '../../../../src/ngtsc/reflection';
import { Reference } from '../../imports';
import { FullSourceMapping, SourceLocation, TypeCheckId, SourceMapping } from '../api';
import { ReferenceEmitEnvironment } from './reference_emit_environment';
/**
 * Adapter interface which allows the directive type-checking diagnostics code to interpret offsets
 * in a TCB and map them back to their original locations.
 */
export interface TypeCheckSourceResolver {
    getTypeCheckId(node: ts.ClassDeclaration): TypeCheckId;
    /**
     * For the given type checking id, retrieve the original source mapping which describes how the
     * offsets in the template should be interpreted.
     */
    getTemplateSourceMapping(id: TypeCheckId): SourceMapping;
    /**
     * Convert an absolute source span coming from the template associated with the given type
     * checking id into a full `ParseSourceSpan`. The returned parse span has line and column
     * numbers in addition to only absolute offsets and gives access to the original source code.
     */
    toTemplateParseSourceSpan(id: TypeCheckId, span: AbsoluteSourceSpan): ParseSourceSpan | null;
    /** For the given type checking id, retrieve the source mapping of its host bindings. */
    getHostBindingsMapping(id: TypeCheckId): SourceMapping;
    /**
     * Convert an absolute source span coming from a host binding associated with the given type
     * checking id into a full `ParseSourceSpan`. The returned parse span has line and column
     * numbers in addition to only absolute offsets and gives access to the original source code.
     */
    toHostParseSourceSpan(id: TypeCheckId, span: AbsoluteSourceSpan): ParseSourceSpan | null;
}
/**
 * Indicates whether a particular component requires an inline type check block.
 *
 * This is not a boolean state as inlining might only be required to get the best possible
 * type-checking, but the component could theoretically still be checked without it.
 */
export declare enum TcbInliningRequirement {
    /**
     * There is no way to type check this component without inlining.
     */
    MustInline = 0,
    /**
     * Inlining should be used due to the component's generic bounds, but a non-inlining fallback
     * method can be used if that's not possible.
     */
    ShouldInlineForGenericBounds = 1,
    /**
     * There is no requirement for this component's TCB to be inlined.
     */
    None = 2
}
export declare function requiresInlineTypeCheckBlock(ref: Reference<ClassDeclaration<ts.ClassDeclaration>>, env: ReferenceEmitEnvironment, usedPipes: Reference<ClassDeclaration<ts.ClassDeclaration>>[], reflector: ReflectionHost): TcbInliningRequirement;
/** Maps a shim position back to a source code location. */
export declare function getSourceMapping(shimSf: ts.SourceFile, position: number, resolver: TypeCheckSourceResolver, isDiagnosticRequest: boolean): FullSourceMapping | null;
export declare function findTypeCheckBlock(file: ts.SourceFile, id: TypeCheckId, isDiagnosticRequest: boolean): ts.Node | null;
/**
 * Traverses up the AST starting from the given node to extract the source location from comments
 * that have been emitted into the TCB. If the node does not exist within a TCB, or if an ignore
 * marker comment is found up the tree (and this is part of a diagnostic request), this function
 * returns null.
 */
export declare function findSourceLocation(node: ts.Node, sourceFile: ts.SourceFile, isDiagnosticsRequest: boolean): SourceLocation | null;
/**
 * Ensure imports for certain external modules that should always
 * exist are generated. These are ensured to exist to avoid frequent
 * import graph changes whenever e.g. a signal input is introduced in user code.
 */
export declare function ensureTypeCheckFilePreparationImports(env: ReferenceEmitEnvironment): void;
export declare function checkIfGenericTypeBoundsCanBeEmitted(node: ClassDeclaration<ts.ClassDeclaration>, reflector: ReflectionHost, env: ReferenceEmitEnvironment): boolean;
export declare function findNodeInFile<T extends ts.Node>(file: ts.SourceFile, predicate: (node: ts.Node) => node is T): T | null;
export declare function findNodeInFile(file: ts.SourceFile, predicate: (node: ts.Node) => boolean): ts.Node | null;
