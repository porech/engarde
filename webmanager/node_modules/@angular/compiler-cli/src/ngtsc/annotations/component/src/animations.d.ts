/*!
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import { TmplAstNode } from '@angular/compiler';
/**
 * Analyzes a component's template to determine if it's using animate.enter
 * or animate.leave syntax.
 */
export declare function analyzeTemplateForAnimations(template: TmplAstNode[]): {
    hasAnimations: boolean;
};
