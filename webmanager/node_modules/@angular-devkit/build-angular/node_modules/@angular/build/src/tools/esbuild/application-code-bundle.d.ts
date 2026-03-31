/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import type { BuildOptions } from 'esbuild';
import type { NormalizedApplicationBuildOptions } from '../../builders/application/options';
import { AngularCompilation } from '../angular/compilation';
import { ComponentStylesheetBundler } from './angular/component-stylesheets';
import { SourceFileCache } from './angular/source-file-cache';
import { BundlerOptionsFactory } from './bundler-context';
import type { LoadResultCache } from './load-result-cache';
export declare function createBrowserCodeBundleOptions(options: NormalizedApplicationBuildOptions, target: string[], sourceFileCache: SourceFileCache, stylesheetBundler: ComponentStylesheetBundler, angularCompilation: AngularCompilation, templateUpdates: Map<string, string> | undefined): BundlerOptionsFactory;
export declare function createBrowserPolyfillBundleOptions(options: NormalizedApplicationBuildOptions, target: string[], sourceFileCache: SourceFileCache, stylesheetBundler: ComponentStylesheetBundler): BuildOptions | BundlerOptionsFactory | undefined;
export declare function createServerPolyfillBundleOptions(options: NormalizedApplicationBuildOptions, target: string[], loadResultCache: LoadResultCache | undefined): BundlerOptionsFactory | undefined;
export declare function createServerMainCodeBundleOptions(options: NormalizedApplicationBuildOptions, target: string[], sourceFileCache: SourceFileCache, stylesheetBundler: ComponentStylesheetBundler): BundlerOptionsFactory;
export declare function createSsrEntryCodeBundleOptions(options: NormalizedApplicationBuildOptions, target: string[], sourceFileCache: SourceFileCache, stylesheetBundler: ComponentStylesheetBundler): BundlerOptionsFactory;
