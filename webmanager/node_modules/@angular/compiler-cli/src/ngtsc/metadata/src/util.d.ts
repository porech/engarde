/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import ts from 'typescript';
import { OwningModule, Reference } from '../../imports';
import { ClassDeclaration, ReflectionHost } from '../../reflection';
import { DirectiveMeta, DirectiveTypeCheckMeta, HostDirectiveMeta, HostDirectiveMetaForGlobalMode, InputMapping, MetadataReader, NgModuleMeta, PipeMeta } from './api';
import { ClassPropertyMapping } from './property_mapping';
export declare function extractReferencesFromType(checker: ts.TypeChecker, def: ts.TypeNode, bestGuessOwningModule: OwningModule | null): {
    result: Reference<ClassDeclaration>[];
    isIncomplete: boolean;
};
export declare function extraReferenceFromTypeQuery(checker: ts.TypeChecker, typeNode: ts.TypeQueryNode, origin: ts.TypeNode, bestGuessOwningModule: OwningModule | null): Reference<ClassDeclaration> | null;
export declare function readBooleanType(type: ts.TypeNode): boolean | null;
export declare function readStringType(type: ts.TypeNode): string | null;
export declare function readMapType<T>(type: ts.TypeNode, valueTransform: (type: ts.TypeNode) => T | null): {
    [key: string]: T;
};
export declare function readStringArrayType(type: ts.TypeNode): string[];
/**
 * Inspects the class' members and extracts the metadata that is used when type-checking templates
 * that use the directive. This metadata does not contain information from a base class, if any,
 * making this metadata invariant to changes of inherited classes.
 */
export declare function extractDirectiveTypeCheckMeta(node: ClassDeclaration, inputs: ClassPropertyMapping<InputMapping>, reflector: ReflectionHost): DirectiveTypeCheckMeta;
/**
 * A `MetadataReader` that reads from an ordered set of child readers until it obtains the requested
 * metadata.
 *
 * This is used to combine `MetadataReader`s that read from different sources (e.g. from a registry
 * and from .d.ts files).
 */
export declare class CompoundMetadataReader implements MetadataReader {
    private readers;
    constructor(readers: MetadataReader[]);
    getDirectiveMetadata(node: Reference<ClassDeclaration<ts.Declaration>>): DirectiveMeta | null;
    getNgModuleMetadata(node: Reference<ClassDeclaration<ts.Declaration>>): NgModuleMeta | null;
    getPipeMetadata(node: Reference<ClassDeclaration<ts.Declaration>>): PipeMeta | null;
}
/** Returns whether a class declaration has the necessary class fields to make it injectable. */
export declare function hasInjectableFields(clazz: ClassDeclaration, host: ReflectionHost): boolean;
export declare function isHostDirectiveMetaForGlobalMode(hostDirectiveMeta: HostDirectiveMeta): hostDirectiveMeta is HostDirectiveMetaForGlobalMode;
