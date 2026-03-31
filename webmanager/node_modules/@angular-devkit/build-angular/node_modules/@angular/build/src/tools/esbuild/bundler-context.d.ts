/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import { BuildOptions, Message, Metafile, OutputFile } from 'esbuild';
import { LoadResultCache } from './load-result-cache';
export type BundleContextResult = {
    errors: Message[];
    warnings: Message[];
} | {
    errors: undefined;
    warnings: Message[];
    metafile: Metafile;
    outputFiles: BuildOutputFile[];
    initialFiles: Map<string, InitialFileRecord>;
    externalImports: {
        server?: Set<string>;
        browser?: Set<string>;
    };
    externalConfiguration?: string[];
};
export interface InitialFileRecord {
    entrypoint: boolean;
    name?: string;
    type: 'script' | 'style';
    external?: boolean;
    serverFile: boolean;
    depth: number;
}
export declare enum BuildOutputFileType {
    Browser = 0,
    Media = 1,
    ServerApplication = 2,
    ServerRoot = 3,
    Root = 4
}
export interface BuildOutputFile extends OutputFile {
    type: BuildOutputFileType;
    readonly size: number;
    clone: () => BuildOutputFile;
}
export type BundlerOptionsFactory<T extends BuildOptions = BuildOptions> = (loadCache: LoadResultCache | undefined) => T;
export declare class BundlerContext {
    #private;
    private workspaceRoot;
    private incremental;
    private initialFilter?;
    readonly watchFiles: Set<string>;
    constructor(workspaceRoot: string, incremental: boolean, options: BuildOptions | BundlerOptionsFactory, initialFilter?: ((initial: Readonly<InitialFileRecord>) => boolean) | undefined);
    static bundleAll(contexts: Iterable<BundlerContext>, changedFiles?: Iterable<string>): Promise<BundleContextResult>;
    static mergeResults(results: BundleContextResult[]): BundleContextResult;
    /**
     * Executes the esbuild build function and normalizes the build result in the event of a
     * build failure that results in no output being generated.
     * All builds use the `write` option with a value of `false` to allow for the output files
     * build result array to be populated.
     *
     * @param force If true, always rebundle.
     * @returns If output files are generated, the full esbuild BuildResult; if not, the
     * warnings and errors for the attempted build.
     */
    bundle(force?: boolean): Promise<BundleContextResult>;
    /**
     * Invalidate a stored bundler result based on the previous watch files
     * and a list of changed files.
     * The context must be created with incremental mode enabled for results
     * to be stored.
     * @returns True, if the result was invalidated; False, otherwise.
     */
    invalidate(files: Iterable<string>): boolean;
    /**
     * Disposes incremental build resources present in the context.
     *
     * @returns A promise that resolves when disposal is complete.
     */
    dispose(): Promise<void>;
}
