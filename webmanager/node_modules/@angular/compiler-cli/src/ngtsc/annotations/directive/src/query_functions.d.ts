/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import { R3QueryMetadata } from '@angular/compiler';
import ts from 'typescript';
import { ImportedSymbolsTracker } from '../../../imports';
import { ClassMember, ReflectionHost } from '../../../reflection';
import { InitializerApiFunction } from './initializer_functions';
/** Possible query initializer API functions. */
export type QueryFunctionName = 'viewChild' | 'contentChild' | 'viewChildren' | 'contentChildren';
/** Possible query initializer API functions. */
export declare const QUERY_INITIALIZER_FNS: (InitializerApiFunction & {
    functionName: QueryFunctionName;
})[];
/**
 * Attempts to detect a possible query definition for the given class member.
 *
 * This function checks for all possible variants of queries and matches the
 * first one. The query is then analyzed and its resolved metadata is returned.
 *
 * @returns Resolved query metadata, or null if no query is declared.
 */
export declare function tryParseSignalQueryFromInitializer(member: Pick<ClassMember, 'name' | 'value' | 'accessLevel'>, reflector: ReflectionHost, importTracker: ImportedSymbolsTracker): {
    name: QueryFunctionName;
    metadata: R3QueryMetadata;
    call: ts.CallExpression;
} | null;
