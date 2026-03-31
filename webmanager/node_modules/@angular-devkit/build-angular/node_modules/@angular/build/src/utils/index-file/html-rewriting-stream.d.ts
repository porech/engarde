/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import type { RewritingStream } from 'parse5-html-rewriting-stream';
export type StartTag = Parameters<RewritingStream['emitStartTag']>[0];
export type EndTag = Parameters<RewritingStream['emitEndTag']>[0];
export type { RewritingStream };
export declare function htmlRewritingStream(content: string): Promise<{
    rewriter: RewritingStream;
    transformedContent: () => Promise<string>;
}>;
