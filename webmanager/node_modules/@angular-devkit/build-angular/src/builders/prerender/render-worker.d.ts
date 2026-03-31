/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
export interface RenderOptions {
    indexFile: string;
    deployUrl: string;
    inlineCriticalCss: boolean;
    minifyCss: boolean;
    outputPath: string;
    serverBundlePath: string;
    route: string;
}
export interface RenderResult {
    errors?: string[];
    warnings?: string[];
}
/**
 * Renders each route in routes and writes them to <outputPath>/<route>/index.html.
 */
declare function render({ indexFile, deployUrl, minifyCss, outputPath, serverBundlePath, route, inlineCriticalCss, }: RenderOptions): Promise<RenderResult>;
/**
 * The default export will be the promise returned by the initialize function.
 * This is awaited by piscina prior to using the Worker.
 */
declare const _default: Promise<typeof render>;
export default _default;
