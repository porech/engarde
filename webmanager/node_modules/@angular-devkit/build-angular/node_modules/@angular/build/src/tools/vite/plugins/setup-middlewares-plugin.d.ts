/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import type { Connect, Plugin } from 'vite';
import { ComponentStyleRecord } from '../middlewares';
import { AngularMemoryOutputFiles, AngularOutputAssets } from '../utils';
export declare enum ServerSsrMode {
    /**
     * No SSR
     */
    NoSsr = 0,
    /**
     * Internal server-side rendering (SSR) is handled through the built-in middleware.
     *
     * In this mode, the SSR process is managed internally by the dev-server's middleware.
     * The server automatically renders pages on the server without requiring external
     * middleware or additional configuration from the developer.
     */
    InternalSsrMiddleware = 1,
    /**
     * External server-side rendering (SSR) is handled by a custom middleware defined in server.ts.
     *
     * This mode allows developers to define custom SSR behavior by providing a middleware in the
     * `server.ts` file. It gives more flexibility for handling SSR, such as integrating with other
     * frameworks or customizing the rendering pipeline.
     */
    ExternalSsrMiddleware = 2
}
interface AngularSetupMiddlewaresPluginOptions {
    outputFiles: AngularMemoryOutputFiles;
    assets: AngularOutputAssets;
    extensionMiddleware?: Connect.NextHandleFunction[];
    indexHtmlTransformer?: (content: string) => Promise<string>;
    componentStyles: Map<string, ComponentStyleRecord>;
    templateUpdates: Map<string, string>;
    ssrMode: ServerSsrMode;
    resetComponentUpdates: () => void;
    projectRoot: string;
}
export declare function createAngularSetupMiddlewaresPlugin(options: AngularSetupMiddlewaresPluginOptions): Plugin;
export {};
