/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import type { ApplicationRef, Type } from '@angular/core';
import type { BootstrapContext } from '@angular/platform-browser';
import type { ɵextractRoutesAndCreateRouteTree, ɵgetOrCreateAngularServerApp } from '@angular/ssr';
/**
 * Represents the exports available from the main server bundle.
 */
interface MainServerBundleExports {
    default: ((context: BootstrapContext) => Promise<ApplicationRef>) | Type<unknown>;
    ɵextractRoutesAndCreateRouteTree: typeof ɵextractRoutesAndCreateRouteTree;
    ɵgetOrCreateAngularServerApp: typeof ɵgetOrCreateAngularServerApp;
}
/**
 * Represents the exports available from the server bundle.
 */
interface ServerBundleExports {
    reqHandler?: unknown;
}
export declare function loadEsmModuleFromMemory(path: './main.server.mjs'): Promise<MainServerBundleExports>;
export declare function loadEsmModuleFromMemory(path: './server.mjs'): Promise<ServerBundleExports>;
export {};
