/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import { ErrorCode, ExtendedTemplateDiagnosticName } from '../../../../diagnostics';
import { TemplateCheckFactory } from '../../api';
/**
 * The list of known control flow directives present in the `CommonModule`.
 *
 * If these control flow directives are missing they will be reported by a separate diagnostic.
 */
export declare const KNOWN_CONTROL_FLOW_DIRECTIVES: Set<string>;
export declare const factory: TemplateCheckFactory<ErrorCode.MISSING_STRUCTURAL_DIRECTIVE, ExtendedTemplateDiagnosticName.MISSING_STRUCTURAL_DIRECTIVE>;
