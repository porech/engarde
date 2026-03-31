/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import ts from 'typescript';
import { ImportedSymbolsTracker } from '../../../imports';
import { ClassMemberAccessLevel, ReflectionHost } from '../../../reflection';
/**
 * @fileoverview
 *
 * Angular exposes functions that can be used as class member initializers
 * to make use of various APIs. Those are called initializer APIs.
 *
 * Signal-based inputs are relying on initializer APIs because such inputs
 * are declared using `input` and `input.required` intersection functions.
 * Similarly, signal-based queries follow the same pattern and are also
 * declared through initializer APIs.
 */
export interface InitializerApiFunction {
    /** Module name where the initializer function is imported from. */
    owningModule: '@angular/core' | '@angular/core/rxjs-interop';
    /** Export name of the initializer function. */
    functionName: 'input' | 'model' | 'output' | 'outputFromObservable' | 'viewChild' | 'viewChildren' | 'contentChild' | 'contentChildren';
    /** Class member access levels compatible with the API. */
    allowedAccessLevels: ClassMemberAccessLevel[];
}
/**
 * Metadata describing an Angular class member that was recognized through
 * a function initializer. Like `input`, `input.required` or `viewChild`.
 */
export interface InitializerFunctionMetadata {
    /** Initializer API function that was recognized. */
    api: InitializerApiFunction;
    /** Node referring to the call expression. */
    call: ts.CallExpression;
    /** Whether the initializer is required or not. E.g. `input.required` was used. */
    isRequired: boolean;
}
/**
 * Attempts to identify an Angular initializer function call.
 *
 * Note that multiple possible initializer API function names can be specified,
 * allowing for checking multiple types in one pass.
 *
 * @returns The parsed initializer API, or null if none was found.
 */
export declare function tryParseInitializerApi<Functions extends InitializerApiFunction[]>(functions: Functions, expression: ts.Expression, reflector: ReflectionHost, importTracker: ImportedSymbolsTracker): (InitializerFunctionMetadata & {
    api: Functions[number];
}) | null;
