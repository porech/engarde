/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import ts from 'typescript';
import { ImportedSymbolsTracker } from '../../../imports';
import { InputOrOutput } from '../../../metadata';
import { ClassMember, ReflectionHost } from '../../../reflection';
import { InitializerApiFunction } from './initializer_functions';
/** Possible functions that can declare an output. */
export declare const OUTPUT_INITIALIZER_FNS: InitializerApiFunction[];
/**
 * Attempts to parse a signal output class member. Returns the parsed
 * input mapping if possible.
 */
export declare function tryParseInitializerBasedOutput(member: Pick<ClassMember, 'name' | 'value' | 'accessLevel'>, reflector: ReflectionHost, importTracker: ImportedSymbolsTracker): {
    call: ts.CallExpression;
    metadata: InputOrOutput;
} | null;
