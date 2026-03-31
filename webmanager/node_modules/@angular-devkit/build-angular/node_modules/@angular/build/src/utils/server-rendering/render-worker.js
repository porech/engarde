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
const fetch_patch_1 = require("./fetch-patch");
const launch_server_1 = require("./launch-server");
const load_esm_from_memory_1 = require("./load-esm-from-memory");
/**
 * This is passed as workerData when setting up the worker via the `piscina` package.
 */
const { outputMode, hasSsrEntry } = node_worker_threads_1.workerData;
let serverURL = launch_server_1.DEFAULT_URL;
/**
 * Renders each route in routes and writes them to <outputPath>/<route>/index.html.
 */
async function renderPage({ url }) {
    const { ɵgetOrCreateAngularServerApp: getOrCreateAngularServerApp } = await (0, load_esm_from_memory_1.loadEsmModuleFromMemory)('./main.server.mjs');
    const angularServerApp = getOrCreateAngularServerApp({
        allowStaticRouteRender: true,
    });
    const response = await angularServerApp.handle(new Request(new URL(url, serverURL), { signal: AbortSignal.timeout(30_000) }));
    return response ? response.text() : null;
}
async function initialize() {
    if (outputMode !== undefined && hasSsrEntry) {
        serverURL = await (0, launch_server_1.launchServer)();
    }
    (0, fetch_patch_1.patchFetchToLoadInMemoryAssets)(serverURL);
    return renderPage;
}
exports.default = initialize();
