"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.url = url;
const node_url_1 = require("node:url");
function url(urlString) {
    const url = (0, node_url_1.parse)(urlString);
    return (context) => context.engine.createSourceFromUrl(url, context)(context);
}
