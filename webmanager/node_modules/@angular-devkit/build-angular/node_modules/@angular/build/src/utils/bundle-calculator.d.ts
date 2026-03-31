/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import { Budget as BudgetEntry, Type as BudgetType } from '../builders/application/schema';
export { type BudgetEntry, BudgetType };
export declare const BYTES_IN_KILOBYTE = 1000;
export interface Threshold {
    limit: number;
    type: ThresholdType;
    severity: ThresholdSeverity;
}
declare enum ThresholdType {
    Max = "maximum",
    Min = "minimum"
}
export declare enum ThresholdSeverity {
    Warning = "warning",
    Error = "error"
}
export interface BudgetCalculatorResult {
    severity: ThresholdSeverity;
    message: string;
    label?: string;
}
export interface BudgetChunk {
    files?: string[];
    names?: string[];
    initial?: boolean;
}
export interface BudgetAsset {
    name: string;
    size: number;
    componentStyle?: boolean;
}
export interface BudgetStats {
    chunks?: BudgetChunk[];
    assets?: BudgetAsset[];
}
export declare function calculateThresholds(budget: BudgetEntry): IterableIterator<Threshold>;
export declare function checkBudgets(budgets: BudgetEntry[], stats: BudgetStats, checkComponentStyles?: boolean): IterableIterator<BudgetCalculatorResult>;
export declare function checkThresholds(thresholds: Iterable<Threshold>, size: number, label?: string): IterableIterator<BudgetCalculatorResult>;
