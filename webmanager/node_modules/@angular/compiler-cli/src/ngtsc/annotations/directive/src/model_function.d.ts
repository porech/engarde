/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import { ImportedSymbolsTracker } from '../../../imports';
import { ModelMapping } from '../../../metadata';
import { ClassMember, ReflectionHost } from '../../../reflection';
import { InitializerApiFunction } from './initializer_functions';
/** Represents a function that can declare a model. */
export declare const MODEL_INITIALIZER_FN: InitializerApiFunction;
/**
 * Attempts to parse a model class member. Returns the parsed model mapping if possible.
 */
export declare function tryParseSignalModelMapping(member: Pick<ClassMember, 'name' | 'value' | 'accessLevel'>, reflector: ReflectionHost, importTracker: ImportedSymbolsTracker): ModelMapping | null;
