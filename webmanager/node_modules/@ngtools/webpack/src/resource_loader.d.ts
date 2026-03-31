/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import type { Compilation } from 'webpack';
export declare class WebpackResourceLoader {
    private _parentCompilation?;
    private _fileDependencies;
    private _reverseDependencies;
    private fileCache?;
    private assetCache?;
    private modifiedResources;
    private outputPathCounter;
    private readonly inlineDataLoaderPath;
    constructor(shouldCache: boolean);
    update(parentCompilation: Compilation, changedFiles?: Iterable<string>): void;
    clearParentCompilation(): void;
    getModifiedResourceFiles(): Set<string>;
    getResourceDependencies(filePath: string): Iterable<string>;
    getAffectedResources(file: string): Iterable<string>;
    setAffectedResources(file: string, resources: Iterable<string>): void;
    private _compile;
    private _evaluate;
    get(filePath: string): Promise<string>;
    process(data: string, fileExtension: string | undefined, resourceType: 'template' | 'style', containingFile?: string): Promise<string>;
}
