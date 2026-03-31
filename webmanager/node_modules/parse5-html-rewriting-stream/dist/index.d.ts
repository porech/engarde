import { SAXParser, type EndTag, type StartTag, type Doctype, type Text, type Comment, type SaxToken } from 'parse5-sax-parser';
/**
 * Streaming [SAX](https://en.wikipedia.org/wiki/Simple_API_for_XML)-style HTML rewriter.
 * A [transform stream](https://nodejs.org/api/stream.html#stream_class_stream_transform) (which means you can pipe _through_ it, see example).
 *
 * The rewriter uses the raw source representation of tokens if they are not modified by the user. Therefore, the resulting
 * HTML is not affected by parser error-recovery mechanisms as in a classical parsing-serialization roundtrip.
 *
 * @example
 *
 * ```js
 * const RewritingStream = require('parse5-html-rewriting-stream');
 * const http = require('http');
 * const fs = require('fs');
 *
 * const file = fs.createWriteStream('/home/google.com.html');
 * const rewriter = new RewritingStream();
 *
 * // Replace divs with spans
 * rewriter.on('startTag', startTag => {
 *     if (startTag.tagName === 'span') {
 *         startTag.tagName = 'div';
 *     }
 *
 *     rewriter.emitStartTag(startTag);
 * });
 *
 * rewriter.on('endTag', endTag => {
 *     if (endTag.tagName === 'span') {
 *         endTag.tagName = 'div';
 *     }
 *
 *     rewriter.emitEndTag(endTag);
 * });
 *
 * // Wrap all text nodes with an <i> tag
 * rewriter.on('text', (_, raw) => {
 *     // Use the raw representation of text without HTML entities decoding
 *     rewriter.emitRaw(`<i>${raw}</i>`);
 * });
 *
 * http.get('http://google.com', res => {
 *    // Assumes response is UTF-8.
 *    res.setEncoding('utf8');
 *    // `RewritingStream` is a `Transform` stream, which means you can pipe
 *    // through it.
 *    res.pipe(rewriter).pipe(file);
 * });
 * ```
 */
export declare class RewritingStream extends SAXParser {
    /** Note: `sourceCodeLocationInfo` is always enabled. */
    constructor();
    _transformChunk(chunk: string): string;
    private _getRawHtml;
    protected emitIfListenerExists(eventName: string, token: SaxToken): boolean;
    protected _emitToken(eventName: string, token: SaxToken): void;
    /** Emits a serialized document type token into the output stream. */
    emitDoctype(token: Doctype): void;
    /** Emits a serialized start tag token into the output stream. */
    emitStartTag(token: StartTag): void;
    /** Emits a serialized end tag token into the output stream. */
    emitEndTag(token: EndTag): void;
    /** Emits a serialized text token into the output stream. */
    emitText({ text }: Text): void;
    /** Emits a serialized comment token into the output stream. */
    emitComment(token: Comment): void;
    /** Emits a raw HTML string into the output stream. */
    emitRaw(html: string): void;
}
export interface RewritingStream {
    /** Raised when the rewriter encounters a start tag. */
    on(event: 'startTag', listener: (startTag: StartTag, rawHtml: string) => void): this;
    /** Raised when rewriter encounters an end tag. */
    on(event: 'endTag', listener: (endTag: EndTag, rawHtml: string) => void): this;
    /** Raised when rewriter encounters a comment. */
    on(event: 'comment', listener: (comment: Comment, rawHtml: string) => void): this;
    /** Raised when rewriter encounters text content. */
    on(event: 'text', listener: (text: Text, rawHtml: string) => void): this;
    /** Raised when rewriter encounters a [document type declaration](https://en.wikipedia.org/wiki/Document_type_declaration). */
    on(event: 'doctype', listener: (doctype: Doctype, rawHtml: string) => void): this;
    /**
     * Base event handler.
     *
     * @param event Name of the event
     * @param handler Event handler
     */
    on(event: string, handler: (...args: any[]) => void): this;
}
