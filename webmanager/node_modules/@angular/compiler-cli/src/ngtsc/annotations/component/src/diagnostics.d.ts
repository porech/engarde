/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import ts from 'typescript';
import { Cycle } from '../../../cycles';
import { Reference } from '../../../imports';
/**
 * Generate a diagnostic related information object that describes a potential cyclic import path.
 */
export declare function makeCyclicImportInfo(ref: Reference, type: string, cycle: Cycle): ts.DiagnosticRelatedInformation;
/**
 * Checks whether a selector is a valid custom element tag name.
 * Based loosely on https://github.com/sindresorhus/validate-element-name.
 */
export declare function checkCustomElementSelectorForErrors(selector: string): string | null;
