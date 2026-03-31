/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import ts from 'typescript';
import { TemplateDiagnostic, TemplateTypeChecker } from '../../api';
import { TemplateSemanticsChecker } from '../api/api';
export declare class TemplateSemanticsCheckerImpl implements TemplateSemanticsChecker {
    private templateTypeChecker;
    constructor(templateTypeChecker: TemplateTypeChecker);
    getDiagnosticsForComponent(component: ts.ClassDeclaration): TemplateDiagnostic[];
}
