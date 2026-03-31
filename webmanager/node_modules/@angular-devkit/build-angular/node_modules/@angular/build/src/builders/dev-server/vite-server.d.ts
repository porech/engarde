/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import type { BuilderContext } from '@angular-devkit/architect';
import type { Plugin } from 'esbuild';
import type { Connect, InlineConfig } from 'vite';
import type { ComponentStyleRecord } from '../../tools/vite/middlewares';
import { ServerSsrMode } from '../../tools/vite/plugins';
import { EsbuildLoaderOption } from '../../tools/vite/utils';
import { Result } from '../application/results';
import { type ApplicationBuilderInternalOptions, BuildOutputFileType, type ExternalResultMetadata, JavaScriptTransformer } from './internal';
import type { NormalizedDevServerOptions } from './options';
import type { DevServerBuilderOutput } from './output';
interface OutputFileRecord {
    contents: Uint8Array;
    size: number;
    hash: string;
    updated: boolean;
    servable: boolean;
    type: BuildOutputFileType;
}
interface OutputAssetRecord {
    source: string;
    updated: boolean;
}
interface DevServerExternalResultMetadata extends Omit<ExternalResultMetadata, 'explicit'> {
    explicitBrowser: string[];
    explicitServer: string[];
}
export type BuilderAction = (options: ApplicationBuilderInternalOptions, context: BuilderContext, plugins?: Plugin[]) => AsyncIterable<Result>;
export declare function serveWithVite(serverOptions: NormalizedDevServerOptions, builderName: string, builderAction: BuilderAction, context: BuilderContext, transformers?: {
    indexHtml?: (content: string) => Promise<string>;
}, extensions?: {
    middleware?: Connect.NextHandleFunction[];
    buildPlugins?: Plugin[];
}): AsyncIterableIterator<DevServerBuilderOutput>;
export declare function setupServer(serverOptions: NormalizedDevServerOptions, outputFiles: Map<string, OutputFileRecord>, assets: Map<string, OutputAssetRecord>, preserveSymlinks: boolean | undefined, externalMetadata: DevServerExternalResultMetadata, ssrMode: ServerSsrMode, prebundleTransformer: JavaScriptTransformer, target: string[], zoneless: boolean, componentStyles: Map<string, ComponentStyleRecord>, templateUpdates: Map<string, string>, prebundleLoaderExtensions: EsbuildLoaderOption | undefined, define: ApplicationBuilderInternalOptions['define'], extensionMiddleware?: Connect.NextHandleFunction[], indexHtmlTransformer?: (content: string) => Promise<string>, thirdPartySourcemaps?: boolean): Promise<InlineConfig>;
export {};
