/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import { FileReplacement } from '../builders/browser/schema';
export declare class MissingFileReplacementException extends Error {
    constructor(path: string);
}
export interface NormalizedFileReplacement {
    replace: string;
    with: string;
}
export declare function normalizeFileReplacements(fileReplacements: FileReplacement[], workspaceRoot: string): NormalizedFileReplacement[];
