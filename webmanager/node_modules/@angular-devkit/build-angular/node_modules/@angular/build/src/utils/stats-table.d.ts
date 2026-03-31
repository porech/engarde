/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import { BudgetCalculatorResult } from './bundle-calculator';
export type BundleStatsData = [
    files: string,
    names: string,
    rawSize: number | string,
    estimatedTransferSize: number | string
];
export interface BundleStats {
    initial: boolean;
    stats: BundleStatsData;
}
export declare function generateEsbuildBuildStatsTable([browserStats, serverStats]: [browserStats: BundleStats[], serverStats: BundleStats[]], colors: boolean, showTotalSize: boolean, showEstimatedTransferSize: boolean, budgetFailures?: BudgetCalculatorResult[], verbose?: boolean): string;
export declare function generateBuildStatsTable(data: BundleStats[], colors: boolean, showTotalSize: boolean, showEstimatedTransferSize: boolean, budgetFailures?: BudgetCalculatorResult[]): string;
