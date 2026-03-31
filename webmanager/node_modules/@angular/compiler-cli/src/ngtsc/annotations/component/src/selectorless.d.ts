/*!
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import { TmplAstNode } from '@angular/compiler';
/**
 * Analyzes a component's template to determine if it's using selectorless syntax
 * and to extract the names of the selectorless symbols that are referenced.
 */
export declare function analyzeTemplateForSelectorless(template: TmplAstNode[]): {
    isSelectorless: boolean;
    localReferencedSymbols: Set<string> | null;
};
