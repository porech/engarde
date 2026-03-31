/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import { FontsClass, OptimizationClass, OptimizationUnion, StylesClass } from '../builders/application/schema';
export type NormalizedOptimizationOptions = Required<Omit<OptimizationClass, 'fonts' | 'styles'>> & {
    fonts: FontsClass;
    styles: StylesClass;
};
export declare function normalizeOptimization(optimization?: OptimizationUnion): NormalizedOptimizationOptions;
