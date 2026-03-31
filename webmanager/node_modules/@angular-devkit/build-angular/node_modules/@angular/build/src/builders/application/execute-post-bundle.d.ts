/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import type { Metafile } from 'esbuild';
import { BuildOutputFile, InitialFileRecord } from '../../tools/esbuild/bundler-context';
import { BuildOutputAsset, PrerenderedRoutesRecord } from '../../tools/esbuild/bundler-execution-result';
import { NormalizedApplicationBuildOptions } from './options';
/**
 * Run additional builds steps including SSG, AppShell, Index HTML file and Service worker generation.
 * @param metafile An esbuild metafile object.
 * @param options The normalized application builder options used to create the build.
 * @param outputFiles The output files of an executed build.
 * @param assetFiles The assets of an executed build.
 * @param initialFiles A map containing initial file information for the executed build.
 * @param locale A language locale to insert in the index.html.
 */
export declare function executePostBundleSteps(metafile: Metafile, options: NormalizedApplicationBuildOptions, outputFiles: BuildOutputFile[], assetFiles: BuildOutputAsset[], initialFiles: Map<string, InitialFileRecord>, locale: string | undefined): Promise<{
    errors: string[];
    warnings: string[];
    additionalOutputFiles: BuildOutputFile[];
    additionalAssets: BuildOutputAsset[];
    prerenderedRoutes: PrerenderedRoutesRecord;
}>;
