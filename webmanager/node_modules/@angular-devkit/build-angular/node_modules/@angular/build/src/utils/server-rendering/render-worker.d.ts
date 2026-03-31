/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import type { OutputMode } from '../../builders/application/schema';
import type { ESMInMemoryFileLoaderWorkerData } from './esm-in-memory-loader/loader-hooks';
export interface RenderWorkerData extends ESMInMemoryFileLoaderWorkerData {
    assetFiles: Record</** Destination */ string, /** Source */ string>;
    outputMode: OutputMode | undefined;
    hasSsrEntry: boolean;
}
export interface RenderOptions {
    url: string;
}
/**
 * Renders each route in routes and writes them to <outputPath>/<route>/index.html.
 */
declare function renderPage({ url }: RenderOptions): Promise<string | null>;
declare const _default: Promise<typeof renderPage>;
export default _default;
