/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
export declare const DEFAULT_URL: import("url").URL;
/**
 * Launches a server that handles local requests.
 *
 * @returns A promise that resolves to the URL of the running server.
 */
export declare function launchServer(): Promise<URL>;
