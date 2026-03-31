/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import { ClassDeclaration } from '../../reflection';
import { ComponentScope, ComponentScopeReader, RemoteScope } from './api';
/**
 * A `ComponentScopeReader` that reads from an ordered set of child readers until it obtains the
 * requested scope.
 *
 * This is used to combine `ComponentScopeReader`s that read from different sources (e.g. from a
 * registry and from the incremental state).
 */
export declare class CompoundComponentScopeReader implements ComponentScopeReader {
    private readers;
    constructor(readers: ComponentScopeReader[]);
    getScopeForComponent(clazz: ClassDeclaration): ComponentScope | null;
    getRemoteScope(clazz: ClassDeclaration): RemoteScope | null;
}
