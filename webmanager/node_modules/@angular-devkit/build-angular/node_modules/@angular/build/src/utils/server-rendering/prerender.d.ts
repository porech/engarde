/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import { NormalizedApplicationBuildOptions } from '../../builders/application/options';
import { OutputMode } from '../../builders/application/schema';
import { BuildOutputFile } from '../../tools/esbuild/bundler-context';
import { BuildOutputAsset } from '../../tools/esbuild/bundler-execution-result';
import { SerializableRouteTreeNode } from './models';
type PrerenderOptions = NormalizedApplicationBuildOptions['prerenderOptions'];
type AppShellOptions = NormalizedApplicationBuildOptions['appShellOptions'];
/**
 * Represents the output of a prerendering process.
 *
 * The key is the file path, and the value is an object containing the following properties:
 *
 * - `content`: The HTML content or output generated for the corresponding file path.
 * - `appShellRoute`: A boolean flag indicating whether the content is an app shell.
 *
 * @example
 * {
 *   '/index.html': { content: '<html>...</html>', appShell: false },
 *   '/shell/index.html': { content: '<html>...</html>', appShellRoute: true }
 * }
 */
type PrerenderOutput = Record<string, {
    content: string;
    appShellRoute: boolean;
}>;
export declare function prerenderPages(workspaceRoot: string, baseHref: string, appShellOptions: AppShellOptions | undefined, prerenderOptions: PrerenderOptions | undefined, outputFiles: Readonly<BuildOutputFile[]>, assets: Readonly<BuildOutputAsset[]>, outputMode: OutputMode | undefined, sourcemap?: boolean, maxThreads?: number): Promise<{
    output: PrerenderOutput;
    warnings: string[];
    errors: string[];
    serializableRouteTreeNode: SerializableRouteTreeNode;
}>;
export {};
