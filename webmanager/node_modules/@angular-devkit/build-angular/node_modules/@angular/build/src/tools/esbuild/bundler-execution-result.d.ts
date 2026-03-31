/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import type { Message, PartialMessage } from 'esbuild';
import type { ChangedFiles } from '../../tools/esbuild/watcher';
import type { ComponentStylesheetBundler } from './angular/component-stylesheets';
import type { SourceFileCache } from './angular/source-file-cache';
import type { BuildOutputFile, BuildOutputFileType, BundlerContext } from './bundler-context';
export interface BuildOutputAsset {
    source: string;
    destination: string;
}
export interface RebuildState {
    rebuildContexts: {
        typescriptContexts: BundlerContext[];
        otherContexts: BundlerContext[];
    };
    componentStyleBundler: ComponentStylesheetBundler;
    codeBundleCache?: SourceFileCache;
    fileChanges: ChangedFiles;
    previousOutputInfo: ReadonlyMap<string, {
        hash: string;
        type: BuildOutputFileType;
    }>;
    previousAssetsInfo: ReadonlyMap<string, string>;
    templateUpdates?: Map<string, string>;
}
export interface ExternalResultMetadata {
    implicitBrowser: string[];
    implicitServer: string[];
    explicit: string[];
}
export type PrerenderedRoutesRecord = Record<string, {
    headers?: Record<string, string>;
}>;
/**
 * Represents the result of a single builder execute call.
 */
export declare class ExecutionResult {
    private rebuildContexts;
    private componentStyleBundler;
    private codeBundleCache?;
    readonly templateUpdates?: Map<string, string> | undefined;
    outputFiles: BuildOutputFile[];
    assetFiles: BuildOutputAsset[];
    errors: (Message | PartialMessage)[];
    prerenderedRoutes: PrerenderedRoutesRecord;
    warnings: (Message | PartialMessage)[];
    logs: string[];
    externalMetadata?: ExternalResultMetadata;
    extraWatchFiles: string[];
    htmlIndexPath?: string;
    htmlBaseHref?: string;
    constructor(rebuildContexts: {
        typescriptContexts: BundlerContext[];
        otherContexts: BundlerContext[];
    }, componentStyleBundler: ComponentStylesheetBundler, codeBundleCache?: SourceFileCache | undefined, templateUpdates?: Map<string, string> | undefined);
    addOutputFile(path: string, content: string | Uint8Array, type: BuildOutputFileType): void;
    addAssets(assets: BuildOutputAsset[]): void;
    addLog(value: string): void;
    addError(error: PartialMessage | string): void;
    addErrors(errors: (PartialMessage | string)[]): void;
    addPrerenderedRoutes(routes: PrerenderedRoutesRecord): void;
    addWarning(error: PartialMessage | string): void;
    addWarnings(errors: (PartialMessage | string)[]): void;
    /**
     * Add external JavaScript import metadata to the result. This is currently used
     * by the development server to optimize the prebundling process.
     * @param implicitBrowser External dependencies for the browser bundles due to the external packages option.
     * @param implicitServer External dependencies for the server bundles due to the external packages option.
     * @param explicit External dependencies due to explicit project configuration.
     */
    setExternalMetadata(implicitBrowser: string[], implicitServer: string[], explicit: string[]): void;
    get output(): {
        success: boolean;
    };
    get outputWithFiles(): {
        success: boolean;
        outputFiles: BuildOutputFile[];
        assetFiles: BuildOutputAsset[];
        errors: (PartialMessage | Message)[];
        externalMetadata: ExternalResultMetadata | undefined;
    };
    get watchFiles(): Readonly<string[]>;
    createRebuildState(fileChanges: ChangedFiles): RebuildState;
    findChangedFiles(previousOutputHashes: ReadonlyMap<string, {
        hash: string;
        type: BuildOutputFileType;
    }>): Set<string>;
    dispose(): Promise<void>;
}
