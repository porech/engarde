/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import { MetadataReader } from '../../metadata';
import { ClassDeclaration, ReflectionHost } from '../../reflection';
import { ComponentScopeReader, SelectorlessScope } from './api';
/**
 * Computes the scope for a selectorless component by looking at imports within the same
 * file and resolving them to metadata.
 */
export declare class SelectorlessComponentScopeReader implements ComponentScopeReader {
    private metaReader;
    private reflector;
    private cache;
    constructor(metaReader: MetadataReader, reflector: ReflectionHost);
    getScopeForComponent(node: ClassDeclaration): SelectorlessScope | null;
    getRemoteScope(): null;
    /** Determines which identifiers a class has access to. */
    private getAvailableIdentifiers;
    private getMetaFromIdentifier;
}
