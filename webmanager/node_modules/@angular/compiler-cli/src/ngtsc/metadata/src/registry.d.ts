/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import { Reference } from '../../imports';
import { ClassDeclaration } from '../../reflection';
import { DirectiveMeta, MetadataReaderWithIndex, MetadataRegistry, MetaKind, NgModuleMeta, PipeMeta } from './api';
/**
 * A registry of directive, pipe, and module metadata for types defined in the current compilation
 * unit, which supports both reading and registering.
 */
export declare class LocalMetadataRegistry implements MetadataRegistry, MetadataReaderWithIndex {
    private directives;
    private ngModules;
    private pipes;
    getDirectiveMetadata(ref: Reference<ClassDeclaration>): DirectiveMeta | null;
    getNgModuleMetadata(ref: Reference<ClassDeclaration>): NgModuleMeta | null;
    getPipeMetadata(ref: Reference<ClassDeclaration>): PipeMeta | null;
    registerDirectiveMetadata(meta: DirectiveMeta): void;
    registerNgModuleMetadata(meta: NgModuleMeta): void;
    registerPipeMetadata(meta: PipeMeta): void;
    getKnown(kind: MetaKind): Array<ClassDeclaration>;
}
/**
 * A `MetadataRegistry` which registers metadata with multiple delegate `MetadataRegistry`
 * instances.
 */
export declare class CompoundMetadataRegistry implements MetadataRegistry {
    private registries;
    constructor(registries: MetadataRegistry[]);
    registerDirectiveMetadata(meta: DirectiveMeta): void;
    registerNgModuleMetadata(meta: NgModuleMeta): void;
    registerPipeMetadata(meta: PipeMeta): void;
}
