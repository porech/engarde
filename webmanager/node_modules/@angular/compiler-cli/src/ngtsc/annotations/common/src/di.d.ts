/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import { R3DependencyMetadata } from '@angular/compiler';
import { ClassDeclaration, CtorParameter, ReflectionHost, UnavailableValue } from '../../../reflection';
export type ConstructorDeps = {
    deps: R3DependencyMetadata[];
} | {
    deps: null;
    errors: ConstructorDepError[];
};
export interface ConstructorDepError {
    index: number;
    param: CtorParameter;
    reason: UnavailableValue;
}
export declare function getConstructorDependencies(clazz: ClassDeclaration, reflector: ReflectionHost, isCore: boolean): ConstructorDeps | null;
/**
 * Convert `ConstructorDeps` into the `R3DependencyMetadata` array for those deps if they're valid,
 * or into an `'invalid'` signal if they're not.
 *
 * This is a companion function to `validateConstructorDependencies` which accepts invalid deps.
 */
export declare function unwrapConstructorDependencies(deps: ConstructorDeps | null): R3DependencyMetadata[] | 'invalid' | null;
export declare function getValidConstructorDependencies(clazz: ClassDeclaration, reflector: ReflectionHost, isCore: boolean): R3DependencyMetadata[] | null;
/**
 * Validate that `ConstructorDeps` does not have any invalid dependencies and convert them into the
 * `R3DependencyMetadata` array if so, or raise a diagnostic if some deps are invalid.
 *
 * This is a companion function to `unwrapConstructorDependencies` which does not accept invalid
 * deps.
 */
export declare function validateConstructorDependencies(clazz: ClassDeclaration, deps: ConstructorDeps | null): R3DependencyMetadata[] | null;
