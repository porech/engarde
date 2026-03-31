"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.RouteRenderMode = void 0;
/**
 * Local copy of `RenderMode` exported from `@angular/ssr`.
 * This constant is needed to handle interop between CommonJS (CJS) and ES Modules (ESM) formats.
 *
 * It maps `RenderMode` enum values to their corresponding numeric identifiers.
 */
exports.RouteRenderMode = {
    Server: 0,
    Client: 1,
    Prerender: 2,
};
