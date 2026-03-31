/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import { ImportedSymbolsTracker } from '../../../imports';
import { InputMapping } from '../../../metadata';
import { ClassMember, ReflectionHost } from '../../../reflection';
import { InitializerApiFunction } from './initializer_functions';
/** Represents a function that can declare an input. */
export declare const INPUT_INITIALIZER_FN: InitializerApiFunction;
/**
 * Attempts to parse a signal input class member. Returns the parsed
 * input mapping if possible.
 */
export declare function tryParseSignalInputMapping(member: Pick<ClassMember, 'name' | 'value' | 'accessLevel'>, reflector: ReflectionHost, importTracker: ImportedSymbolsTracker): InputMapping | null;
