/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import { LegacyAnimationTriggerNames } from '@angular/compiler';
import ts from 'typescript';
import { Reference } from '../../../imports';
import { ForeignFunctionResolver, ResolvedValue } from '../../../partial_evaluator';
import { ClassDeclaration } from '../../../reflection';
/**
 * Collect the animation names from the static evaluation result.
 * @param value the static evaluation result of the animations
 * @param legacyAnimationTriggerNames the animation names collected and whether some names could not be
 *     statically evaluated.
 */
export declare function collectLegacyAnimationNames(value: ResolvedValue, legacyAnimationTriggerNames: LegacyAnimationTriggerNames): void;
export declare function isLegacyAngularAnimationsReference(reference: Reference, symbolName: string): boolean;
export declare const legacyAnimationTriggerResolver: ForeignFunctionResolver;
export declare function validateAndFlattenComponentImports(imports: ResolvedValue, expr: ts.Expression, isDeferred: boolean): {
    imports: Reference<ClassDeclaration>[];
    diagnostics: ts.Diagnostic[];
};
