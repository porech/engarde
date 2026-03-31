"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.isSsrNodeRequestHandler = isSsrNodeRequestHandler;
exports.isSsrRequestHandler = isSsrRequestHandler;
function isSsrNodeRequestHandler(value) {
    return typeof value === 'function' && '__ng_node_request_handler__' in value;
}
function isSsrRequestHandler(value) {
    return typeof value === 'function' && '__ng_request_handler__' in value;
}
