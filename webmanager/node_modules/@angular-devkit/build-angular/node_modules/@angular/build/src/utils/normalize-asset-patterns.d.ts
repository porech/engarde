/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import { AssetPattern, AssetPatternClass } from '../builders/application/schema';
export declare class MissingAssetSourceRootException extends Error {
    constructor(path: string);
}
export declare function normalizeAssetPatterns(assetPatterns: AssetPattern[], workspaceRoot: string, projectRoot: string, projectSourceRoot: string | undefined): (AssetPatternClass & {
    output: string;
})[];
