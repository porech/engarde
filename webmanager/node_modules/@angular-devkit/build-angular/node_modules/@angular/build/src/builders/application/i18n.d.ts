/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import { BuilderContext } from '@angular-devkit/architect';
import type { Metafile } from 'esbuild';
import { InitialFileRecord } from '../../tools/esbuild/bundler-context';
import { ExecutionResult, PrerenderedRoutesRecord } from '../../tools/esbuild/bundler-execution-result';
import { NormalizedApplicationBuildOptions } from './options';
/**
 * Inlines all active locales as specified by the application build options into all
 * application JavaScript files created during the build.
 * @param metafile An esbuild metafile object.
 * @param options The normalized application builder options used to create the build.
 * @param executionResult The result of an executed build.
 * @param initialFiles A map containing initial file information for the executed build.
 */
export declare function inlineI18n(metafile: Metafile, options: NormalizedApplicationBuildOptions, executionResult: ExecutionResult, initialFiles: Map<string, InitialFileRecord>): Promise<{
    errors: string[];
    warnings: string[];
    prerenderedRoutes: PrerenderedRoutesRecord;
}>;
/**
 * Loads all active translations using the translation loaders from the `@angular/localize` package.
 * @param context The architect builder context for the current build.
 * @param i18n The normalized i18n options to use.
 */
export declare function loadActiveTranslations(context: BuilderContext, i18n: NormalizedApplicationBuildOptions['i18nOptions']): Promise<void>;
