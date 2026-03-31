/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import { IndexHtmlGenerator, IndexHtmlGeneratorOptions, IndexHtmlGeneratorProcessOptions } from '@angular/build/private';
import { Compilation, Compiler } from 'webpack';
export interface IndexHtmlWebpackPluginOptions extends IndexHtmlGeneratorOptions, Omit<IndexHtmlGeneratorProcessOptions, 'files'> {
}
export declare class IndexHtmlWebpackPlugin extends IndexHtmlGenerator {
    readonly options: IndexHtmlWebpackPluginOptions;
    private _compilation;
    get compilation(): Compilation;
    constructor(options: IndexHtmlWebpackPluginOptions);
    apply(compiler: Compiler): void;
    readAsset(path: string): Promise<string>;
    protected readIndex(path: string): Promise<string>;
}
