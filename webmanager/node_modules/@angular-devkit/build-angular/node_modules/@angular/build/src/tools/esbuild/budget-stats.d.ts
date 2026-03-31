/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import type { Metafile } from 'esbuild';
import type { BudgetStats } from '../../utils/bundle-calculator';
import { type BuildOutputFile, type InitialFileRecord } from './bundler-context';
/**
 * Generates a bundle budget calculator compatible stats object that provides
 * the necessary information for the Webpack-based bundle budget code to
 * interoperate with the esbuild-based builders.
 * @param metafile The esbuild metafile of a build to use.
 * @param initialFiles The records of all initial files of a build.
 * @returns A bundle budget compatible stats object.
 */
export declare function generateBudgetStats(metafile: Metafile, outputFiles: BuildOutputFile[], initialFiles: Map<string, InitialFileRecord>): BudgetStats;
