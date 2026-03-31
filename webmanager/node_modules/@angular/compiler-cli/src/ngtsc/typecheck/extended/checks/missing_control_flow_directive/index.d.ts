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
 * The list of known control flow directives present in the `CommonModule`,
 * and their corresponding imports.
 *
 * Note: there is no `ngSwitch` here since it's typically used as a regular
 * binding (e.g. `[ngSwitch]`), however the `ngSwitchCase` and `ngSwitchDefault`
 * are used as structural directives and a warning would be generated. Once the
 * `CommonModule` is included, the `ngSwitch` would also be covered.
 */
export declare const KNOWN_CONTROL_FLOW_DIRECTIVES: Map<string, {
    directive: string;
    builtIn: string;
}>;
export declare const factory: TemplateCheckFactory<ErrorCode.MISSING_CONTROL_FLOW_DIRECTIVE, ExtendedTemplateDiagnosticName.MISSING_CONTROL_FLOW_DIRECTIVE>;
