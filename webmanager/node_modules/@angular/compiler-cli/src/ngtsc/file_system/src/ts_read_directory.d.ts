/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import ts from 'typescript';
import { FileSystem } from './types';
declare module 'typescript' {
    interface FileSystemEntries {
        readonly files: readonly string[];
        readonly directories: readonly string[];
    }
    const matchFiles: undefined | ((path: string, extensions: readonly string[] | undefined, excludes: readonly string[] | undefined, includes: readonly string[] | undefined, useCaseSensitiveFileNames: boolean, currentDirectory: string, depth: number | undefined, getFileSystemEntries: (path: string) => FileSystemEntries, realpath: (path: string) => string, directoryExists: (path: string) => boolean) => string[]);
}
/**
 * Creates a {@link ts.CompilerHost#readDirectory} implementation function,
 * that leverages the specified file system (that may be e.g. virtual).
 */
export declare function createFileSystemTsReadDirectoryFn(fs: FileSystem): NonNullable<ts.CompilerHost['readDirectory']>;
