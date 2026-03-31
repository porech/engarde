/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import type { Connect, ViteDevServer } from 'vite';
export declare function createAngularComponentMiddleware(server: ViteDevServer, templateUpdates: ReadonlyMap<string, string>): Connect.NextHandleFunction;
