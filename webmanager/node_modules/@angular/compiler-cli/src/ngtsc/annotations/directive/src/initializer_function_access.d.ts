/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import { ClassMember } from '../../../reflection';
import { InitializerFunctionMetadata } from './initializer_functions';
/**
 * Validates that the initializer member is compatible with the given class
 * member in terms of field access and visibility.
 *
 * @throws {FatalDiagnosticError} If the recognized initializer API is
 *   incompatible.
 */
export declare function validateAccessOfInitializerApiMember({ api, call }: InitializerFunctionMetadata, member: Pick<ClassMember, 'accessLevel'>): void;
