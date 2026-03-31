"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.addEventDispatchContract = addEventDispatchContract;
const promises_1 = require("node:fs/promises");
const html_rewriting_stream_1 = require("./html-rewriting-stream");
let jsActionContractScript;
async function addEventDispatchContract(html) {
    const { rewriter, transformedContent } = await (0, html_rewriting_stream_1.htmlRewritingStream)(html);
    jsActionContractScript ??=
        '<script type="text/javascript" id="ng-event-dispatch-contract">' +
            (await (0, promises_1.readFile)(require.resolve('@angular/core/event-dispatch-contract.min.js'), 'utf-8')) +
            '</script>';
    rewriter.on('startTag', (tag) => {
        rewriter.emitStartTag(tag);
        if (tag.tagName === 'body') {
            rewriter.emitRaw(jsActionContractScript);
        }
    });
    return transformedContent();
}
