/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import { TransplantedType, Type } from '@angular/compiler';
import ts from 'typescript';
import { ImportFlags, Reference, ReferenceEmitter } from '../../imports';
import { ReflectionHost } from '../../reflection';
import { ImportManager } from '../../translator';
/**
 * An environment for a given source file that can be used to emit references.
 *
 * This can be used by the type-checking block, or constructor logic to generate
 * references to directives or other symbols or types.
 */
export declare class ReferenceEmitEnvironment {
    readonly importManager: ImportManager;
    protected refEmitter: ReferenceEmitter;
    readonly reflector: ReflectionHost;
    contextFile: ts.SourceFile;
    constructor(importManager: ImportManager, refEmitter: ReferenceEmitter, reflector: ReflectionHost, contextFile: ts.SourceFile);
    canReferenceType(ref: Reference, flags?: ImportFlags): boolean;
    /**
     * Generate a `ts.TypeNode` that references the given node as a type.
     *
     * This may involve importing the node into the file if it's not declared there already.
     */
    referenceType(ref: Reference, flags?: ImportFlags): ts.TypeNode;
    /**
     * Generate a `ts.Expression` that refers to the external symbol. This
     * may result in new imports being generated.
     */
    referenceExternalSymbol(moduleName: string, name: string): ts.Expression;
    /**
     * Generate a `ts.TypeNode` that references a given type from the provided module.
     *
     * This will involve importing the type into the file, and will also add type parameters if
     * provided.
     */
    referenceExternalType(moduleName: string, name: string, typeParams?: Type[]): ts.TypeNode;
    /**
     * Generates a `ts.TypeNode` representing a type that is being referenced from a different place
     * in the program. Any type references inside the transplanted type will be rewritten so that
     * they can be imported in the context file.
     */
    referenceTransplantedType(type: TransplantedType<Reference<ts.TypeNode>>): ts.TypeNode;
}
