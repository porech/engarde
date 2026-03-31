/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import { R3DependencyMetadata } from '@angular/compiler';
import { ClassDeclaration, ReflectionHost } from '../../../reflection';
export interface InjectableMeta {
    ctorDeps: R3DependencyMetadata[] | 'invalid' | null;
}
/**
 * Registry that keeps track of classes that can be constructed via dependency injection (e.g.
 * injectables, directives, pipes).
 */
export declare class InjectableClassRegistry {
    private host;
    private isCore;
    private classes;
    constructor(host: ReflectionHost, isCore: boolean);
    registerInjectable(declaration: ClassDeclaration, meta: InjectableMeta): void;
    getInjectableMeta(declaration: ClassDeclaration): InjectableMeta | null;
}
