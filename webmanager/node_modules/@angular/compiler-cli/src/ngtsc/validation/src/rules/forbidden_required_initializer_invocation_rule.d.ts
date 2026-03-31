/*!
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import ts from 'typescript';
import { ImportedSymbolsTracker } from '../../../imports';
import { ReflectionHost } from '../../../reflection';
import { SourceFileValidatorRule } from './api';
/**
 * Rule that flags forbidden invocations of required initializers in property initializers and constructors.
 */
export declare class ForbiddenRequiredInitializersInvocationRule implements SourceFileValidatorRule {
    private reflector;
    private importedSymbolsTracker;
    constructor(reflector: ReflectionHost, importedSymbolsTracker: ImportedSymbolsTracker);
    shouldCheck(sourceFile: ts.SourceFile): boolean;
    checkNode(node: ts.Node): ts.Diagnostic[] | null;
    private isPropDeclarationARequiredInitializer;
}
