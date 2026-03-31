/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import ts from 'typescript';
import { Reference } from '../../../imports';
import { PartialEvaluator, ResolvedValue } from '../../../partial_evaluator';
import { ClassDeclaration, Decorator } from '../../../reflection';
export declare function resolveEnumValue(evaluator: PartialEvaluator, metadata: Map<string, ts.Expression>, field: string, enumSymbolName: string, isCore: boolean): number | null;
/**
 * Resolves a EncapsulationEnum expression locally on best effort without having to calculate the
 * reference. This suites local compilation mode where each file is compiled individually.
 *
 * The static analysis is still needed in local compilation mode since the value of this enum will
 * be used later to decide the generated code for styles.
 */
export declare function resolveEncapsulationEnumValueLocally(expr?: ts.Expression): number | null;
/** Determines if the result of an evaluation is a string array. */
export declare function isStringArray(resolvedValue: ResolvedValue): resolvedValue is string[];
export declare function isClassReferenceArray(resolvedValue: ResolvedValue): resolvedValue is Reference<ClassDeclaration>[];
export declare function isArray(value: ResolvedValue): value is Array<ResolvedValue>;
export declare function resolveLiteral(decorator: Decorator, literalCache: Map<Decorator, ts.ObjectLiteralExpression>): ts.ObjectLiteralExpression;
