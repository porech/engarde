/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import { NormalizedCachedOptions } from '../normalize-cache';
import { NormalizedOptimizationOptions } from '../normalize-optimization';
import { CrossOriginValue, Entrypoint, FileInfo } from './augment-index-html';
export type HintMode = 'prefetch' | 'preload' | 'modulepreload' | 'preconnect' | 'dns-prefetch';
export interface IndexHtmlGeneratorProcessOptions {
    lang: string | undefined;
    baseHref: string | undefined;
    outputPath: string;
    files: FileInfo[];
    hints?: {
        url: string;
        mode: HintMode;
        as?: string;
    }[];
}
export interface AutoCspOptions {
    unsafeEval: boolean;
}
export interface IndexHtmlGeneratorOptions {
    indexPath: string;
    deployUrl?: string;
    sri?: boolean;
    entrypoints: Entrypoint[];
    postTransform?: IndexHtmlTransform;
    crossOrigin?: CrossOriginValue;
    optimization?: NormalizedOptimizationOptions;
    cache?: NormalizedCachedOptions;
    imageDomains?: string[];
    generateDedicatedSSRContent?: boolean;
    autoCsp?: AutoCspOptions;
}
export type IndexHtmlTransform = (content: string) => Promise<string>;
export interface IndexHtmlPluginTransformResult {
    content: string;
    warnings: string[];
    errors: string[];
}
export interface IndexHtmlProcessResult {
    csrContent: string;
    ssrContent?: string;
    warnings: string[];
    errors: string[];
}
export declare class IndexHtmlGenerator {
    readonly options: IndexHtmlGeneratorOptions;
    private readonly plugins;
    private readonly csrPlugins;
    private readonly ssrPlugins;
    constructor(options: IndexHtmlGeneratorOptions);
    process(options: IndexHtmlGeneratorProcessOptions): Promise<IndexHtmlProcessResult>;
    private runPlugins;
    readAsset(path: string): Promise<string>;
    protected readIndex(path: string): Promise<string>;
}
