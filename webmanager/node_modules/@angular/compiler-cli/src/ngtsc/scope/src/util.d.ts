/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import ts from 'typescript';
import { Reference } from '../../imports';
import { ClassDeclaration } from '../../reflection';
import { ComponentScopeReader } from './api';
export declare function getDiagnosticNode(ref: Reference<ClassDeclaration>, rawExpr: ts.Expression | null): ts.Expression;
export declare function makeNotStandaloneDiagnostic(scopeReader: ComponentScopeReader, ref: Reference<ClassDeclaration>, rawExpr: ts.Expression | null, kind: 'component' | 'directive' | 'pipe'): ts.Diagnostic;
export declare function makeUnknownComponentImportDiagnostic(ref: Reference<ClassDeclaration>, rawExpr: ts.Expression): ts.DiagnosticWithLocation;
export declare function makeUnknownComponentDeferredImportDiagnostic(ref: Reference<ClassDeclaration>, rawExpr: ts.Expression): ts.DiagnosticWithLocation;
