/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
export interface NormalizedCachedOptions {
    /** Whether disk cache is enabled. */
    enabled: boolean;
    /** Disk cache path. Example: `/.angular/cache/v12.0.0`. */
    path: string;
    /** Disk cache base path. Example: `/.angular/cache`. */
    basePath: string;
}
export declare function normalizeCacheOptions(projectMetadata: unknown, worspaceRoot: string): NormalizedCachedOptions;
