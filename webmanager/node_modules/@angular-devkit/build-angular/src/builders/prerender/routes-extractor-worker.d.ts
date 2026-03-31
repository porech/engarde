/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
export interface RoutesExtractorWorkerData {
    zonePackage: string;
    indexFile: string;
    outputPath: string;
    serverBundlePath: string;
}
declare function extract(): Promise<string[]>;
/**
 * The default export will be the promise returned by the initialize function.
 * This is awaited by piscina prior to using the Worker.
 */
declare const _default: Promise<typeof extract>;
export default _default;
