/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import type { Config, Filesystem } from '@angular/service-worker/config';
import { promises as fsPromises } from 'node:fs';
import { BuildOutputFile } from '../tools/esbuild/bundler-context';
import { BuildOutputAsset } from '../tools/esbuild/bundler-execution-result';
export declare function augmentAppWithServiceWorker(appRoot: string, workspaceRoot: string, outputPath: string, baseHref: string, ngswConfigPath?: string, inputFileSystem?: typeof fsPromises, outputFileSystem?: typeof fsPromises): Promise<void>;
export declare function augmentAppWithServiceWorkerEsbuild(workspaceRoot: string, configPath: string, baseHref: string, indexHtml: string | undefined, outputFiles: BuildOutputFile[], assetFiles: BuildOutputAsset[]): Promise<{
    manifest: string;
    assetFiles: BuildOutputAsset[];
}>;
export declare function augmentAppWithServiceWorkerCore(config: Config, serviceWorkerFilesystem: Filesystem, baseHref: string): Promise<{
    manifest: string;
    assetFiles: {
        source: string;
        destination: string;
    }[];
}>;
