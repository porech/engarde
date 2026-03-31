/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import { OutputMode } from '../../builders/application/schema';
import { ESMInMemoryFileLoaderWorkerData } from './esm-in-memory-loader/loader-hooks';
import { RoutersExtractorWorkerResult } from './models';
export interface ExtractRoutesWorkerData extends ESMInMemoryFileLoaderWorkerData {
    outputMode: OutputMode | undefined;
}
/** Renders an application based on a provided options. */
declare function extractRoutes(): Promise<RoutersExtractorWorkerResult>;
export default extractRoutes;
