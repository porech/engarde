/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import type { Connect, ViteDevServer } from 'vite';
import { AngularMemoryOutputFiles } from '../utils';
export declare function createAngularIndexHtmlMiddleware(server: ViteDevServer, outputFiles: AngularMemoryOutputFiles, resetComponentUpdates: () => void, indexHtmlTransformer: ((content: string) => Promise<string>) | undefined): Connect.NextHandleFunction;
