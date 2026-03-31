"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.htmlRewritingStream = htmlRewritingStream;
const node_stream_1 = require("node:stream");
const promises_1 = require("node:stream/promises");
const load_esm_1 = require("../load-esm");
async function htmlRewritingStream(content) {
    const { RewritingStream } = await (0, load_esm_1.loadEsmModule)('parse5-html-rewriting-stream');
    const rewriter = new RewritingStream();
    return {
        rewriter,
        transformedContent: () => (0, promises_1.pipeline)(node_stream_1.Readable.from(content), rewriter, async function (source) {
            const chunks = [];
            for await (const chunk of source) {
                chunks.push(Buffer.from(chunk));
            }
            return Buffer.concat(chunks).toString('utf-8');
        }),
    };
}
