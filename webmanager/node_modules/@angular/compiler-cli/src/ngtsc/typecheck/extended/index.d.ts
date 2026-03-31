/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import { ErrorCode, ExtendedTemplateDiagnosticName } from '../../diagnostics';
import { TemplateCheckFactory } from './api';
export { ExtendedTemplateCheckerImpl } from './src/extended_template_checker';
export declare const ALL_DIAGNOSTIC_FACTORIES: readonly TemplateCheckFactory<ErrorCode, ExtendedTemplateDiagnosticName>[];
export declare const SUPPORTED_DIAGNOSTIC_NAMES: Set<string>;
