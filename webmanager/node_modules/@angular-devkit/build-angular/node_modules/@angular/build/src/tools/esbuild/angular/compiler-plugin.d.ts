/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import type { Plugin } from 'esbuild';
import { AngularCompilation } from '../../angular/compilation';
import { LoadResultCache } from '../load-result-cache';
import { ComponentStylesheetBundler } from './component-stylesheets';
import { SourceFileCache } from './source-file-cache';
export interface CompilerPluginOptions {
    sourcemap: boolean | 'external';
    tsconfig: string;
    jit?: boolean;
    /**
     * Include class metadata and JIT information in built code.
     * The Angular TestBed APIs require additional metadata for the Angular aspects of the application
     * such as Components, Modules, Pipes, etc.
     * TestBed may also leverage JIT capabilities during testing (e.g., overrideComponent).
     */
    includeTestMetadata?: boolean;
    advancedOptimizations?: boolean;
    thirdPartySourcemaps?: boolean;
    fileReplacements?: Record<string, string>;
    sourceFileCache?: SourceFileCache;
    loadResultCache?: LoadResultCache;
    incremental: boolean;
    externalRuntimeStyles?: boolean;
    instrumentForCoverage?: (request: string) => boolean;
    templateUpdates?: Map<string, string>;
}
export declare function createCompilerPlugin(pluginOptions: CompilerPluginOptions, compilationOrFactory: AngularCompilation | (() => Promise<AngularCompilation>), stylesheetBundler: ComponentStylesheetBundler): Plugin;
