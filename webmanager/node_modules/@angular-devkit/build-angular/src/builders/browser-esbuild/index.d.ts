/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import { type ApplicationBuilderOptions } from '@angular/build';
import { BuilderContext, BuilderOutput } from '@angular-devkit/architect';
import type { Plugin } from 'esbuild';
import type { Schema as BrowserBuilderOptions } from './schema';
export type { BrowserBuilderOptions };
type OutputPathClass = Exclude<ApplicationBuilderOptions['outputPath'], string | undefined>;
/**
 * Main execution function for the esbuild-based application builder.
 * The options are compatible with the Webpack-based builder.
 * @param userOptions The browser builder options to use when setting up the application build
 * @param context The Architect builder context object
 * @returns An async iterable with the builder result output
 */
export declare function buildEsbuildBrowser(userOptions: BrowserBuilderOptions, context: BuilderContext, infrastructureSettings?: {
    write?: boolean;
}, plugins?: Plugin[]): AsyncIterable<BuilderOutput>;
export declare function convertBrowserOptions(options: BrowserBuilderOptions): Omit<ApplicationBuilderOptions, 'outputPath'> & {
    outputPath: OutputPathClass;
};
declare const _default: import("@angular-devkit/architect").Builder<BrowserBuilderOptions & import("@angular-devkit/core").JsonObject>;
export default _default;
