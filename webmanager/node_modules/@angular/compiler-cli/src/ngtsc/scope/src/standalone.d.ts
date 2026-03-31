/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import { MetadataReader } from '../../metadata';
import { ClassDeclaration } from '../../reflection';
import { ComponentScopeReader, StandaloneScope } from './api';
import { DtsModuleScopeResolver } from './dependency';
import { LocalModuleScopeRegistry } from './local';
/**
 * Computes scopes for standalone components based on their `imports`, expanding imported NgModule
 * scopes where necessary.
 */
export declare class StandaloneComponentScopeReader implements ComponentScopeReader {
    private metaReader;
    private localModuleReader;
    private dtsModuleReader;
    private cache;
    constructor(metaReader: MetadataReader, localModuleReader: LocalModuleScopeRegistry, dtsModuleReader: DtsModuleScopeResolver);
    getScopeForComponent(clazz: ClassDeclaration): StandaloneScope | null;
    getRemoteScope(): null;
}
