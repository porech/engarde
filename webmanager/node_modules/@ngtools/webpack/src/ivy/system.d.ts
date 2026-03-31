/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import * as ts from 'typescript';
import { Compiler } from 'webpack';
export type InputFileSystem = NonNullable<Compiler['inputFileSystem']>;
export interface InputFileSystemSync extends InputFileSystem {
    readFileSync: NonNullable<InputFileSystem['readFileSync']>;
    statSync: NonNullable<InputFileSystem['statSync']>;
}
export declare function createWebpackSystem(input: InputFileSystemSync, currentDirectory: string): ts.System;
