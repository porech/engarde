"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
const node_worker_threads_1 = require("node:worker_threads");
const schema_1 = require("../../builders/application/schema");
const fetch_patch_1 = require("./fetch-patch");
const launch_server_1 = require("./launch-server");
const load_esm_from_memory_1 = require("./load-esm-from-memory");
/**
 * This is passed as workerData when setting up the worker via the `piscina` package.
 */
const { outputMode, hasSsrEntry } = node_worker_threads_1.workerData;
/** Renders an application based on a provided options. */
async function extractRoutes() {
    const serverURL = outputMode !== undefined && hasSsrEntry ? await (0, launch_server_1.launchServer)() : launch_server_1.DEFAULT_URL;
    (0, fetch_patch_1.patchFetchToLoadInMemoryAssets)(serverURL);
    const { ɵextractRoutesAndCreateRouteTree: extractRoutesAndCreateRouteTree } = await (0, load_esm_from_memory_1.loadEsmModuleFromMemory)('./main.server.mjs');
    const { routeTree, appShellRoute, errors } = await extractRoutesAndCreateRouteTree({
        url: serverURL,
        invokeGetPrerenderParams: outputMode !== undefined,
        includePrerenderFallbackRoutes: outputMode === schema_1.OutputMode.Server,
        signal: AbortSignal.timeout(30_000),
    });
    return {
        errors,
        appShellRoute,
        serializedRouteTree: routeTree.toObject(),
    };
}
exports.default = extractRoutes;
