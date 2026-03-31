/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import { DirectiveMatcher, SchemaMetadata } from '@angular/compiler';
import { Reference } from '../../imports';
import { DirectiveMeta, HostDirectivesResolver, MetadataReader, PipeMeta } from '../../metadata';
import { ClassDeclaration } from '../../reflection';
import { ComponentScopeReader } from './api';
/**
 * The scope that is used for type-check code generation of a component template.
 */
export interface TypeCheckScope {
    /**
     * A `DirectiveMatcher` instance that contains the flattened directive metadata of all directives
     * that are in the compilation scope of the declaring NgModule.
     */
    matcher: DirectiveMatcher<DirectiveMeta> | null;
    /**
     * All of the directives available in the compilation scope of the declaring NgModule.
     */
    directives: DirectiveMeta[];
    /**
     * The pipes that are available in the compilation scope.
     */
    pipes: Map<string, PipeMeta>;
    /**
     * The schemas that are used in this scope.
     */
    schemas: SchemaMetadata[];
    /**
     * Whether the original compilation scope which produced this `TypeCheckScope` was itself poisoned
     * (contained semantic errors during its production).
     */
    isPoisoned: boolean;
    /**
     * Directives that have been set on the host of the scope.
     */
    directivesOnHost: DirectiveMeta[] | null;
}
/**
 * Computes scope information to be used in template type checking.
 */
export declare class TypeCheckScopeRegistry {
    private scopeReader;
    private metaReader;
    private hostDirectivesResolver;
    /**
     * Cache of flattened directive metadata. Because flattened metadata is scope-invariant it's
     * cached individually, such that all scopes refer to the same flattened metadata.
     */
    private flattenedDirectiveMetaCache;
    /**
     * Cache of the computed type check scope per NgModule declaration.
     */
    private scopeCache;
    constructor(scopeReader: ComponentScopeReader, metaReader: MetadataReader, hostDirectivesResolver: HostDirectivesResolver);
    /**
     * Computes the type-check scope information for the component declaration. If the NgModule
     * contains an error, then 'error' is returned. If the component is not declared in any NgModule,
     * an empty type-check scope is returned.
     */
    getTypeCheckScope(ref: Reference<ClassDeclaration>): TypeCheckScope;
    getTypeCheckDirectiveMetadata(ref: Reference<ClassDeclaration>): DirectiveMeta | null;
    private applyExplicitlyDeferredFlag;
    private getSelectorMatcher;
    private getSelectorlessMatcher;
    private combineWithHostDirectives;
}
