/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import ts from 'typescript';
import { AbsoluteFsPath } from '../../file_system';
import { TopLevelShimGenerator } from '../../shims/api';
export declare class FlatIndexGenerator implements TopLevelShimGenerator {
    readonly entryPoint: AbsoluteFsPath;
    readonly moduleName: string | null;
    readonly flatIndexPath: string;
    readonly shouldEmit = true;
    constructor(entryPoint: AbsoluteFsPath, relativeFlatIndexPath: string, moduleName: string | null);
    makeTopLevelShim(): ts.SourceFile;
}
