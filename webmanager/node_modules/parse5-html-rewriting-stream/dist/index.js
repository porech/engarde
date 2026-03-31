import { html } from 'parse5';
import { SAXParser, } from 'parse5-sax-parser';
import { escapeText, escapeAttribute } from 'entities/escape';
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
export class RewritingStream extends SAXParser {
    /** Note: `sourceCodeLocationInfo` is always enabled. */
    constructor() {
        super({ sourceCodeLocationInfo: true });
    }
    _transformChunk(chunk) {
        // NOTE: ignore upstream return values as we want to push to
        // the `Writable` part of the `Transform` stream ourselves.
        super._transformChunk(chunk);
        return '';
    }
    _getRawHtml(location) {
        const { droppedBufferSize, html } = this.tokenizer.preprocessor;
        const start = location.startOffset - droppedBufferSize;
        const end = location.endOffset - droppedBufferSize;
        return html.slice(start, end);
    }
    // Events
    emitIfListenerExists(eventName, token) {
        if (!super.emitIfListenerExists(eventName, token)) {
            this.emitRaw(this._getRawHtml(token.sourceCodeLocation));
        }
        // NOTE: don't skip new lines after `<pre>` and other tags,
        // otherwise we'll have incorrect raw data.
        this.parserFeedbackSimulator.skipNextNewLine = false;
        return true;
    }
    // Emitter API
    _emitToken(eventName, token) {
        this.emit(eventName, token, this._getRawHtml(token.sourceCodeLocation));
    }
    /** Emits a serialized document type token into the output stream. */
    emitDoctype(token) {
        let res = `<!DOCTYPE ${token.name}`;
        if (token.publicId !== null) {
            res += ` PUBLIC "${token.publicId}"`;
        }
        else if (token.systemId !== null) {
            res += ' SYSTEM';
        }
        if (token.systemId !== null) {
            res += ` "${token.systemId}"`;
        }
        res += '>';
        this.push(res);
    }
    /** Emits a serialized start tag token into the output stream. */
    emitStartTag(token) {
        let res = `<${token.tagName}`;
        for (const attr of token.attrs) {
            res += ` ${attr.name}="${escapeAttribute(attr.value)}"`;
        }
        res += token.selfClosing ? '/>' : '>';
        this.push(res);
    }
    /** Emits a serialized end tag token into the output stream. */
    emitEndTag(token) {
        this.push(`</${token.tagName}>`);
    }
    /** Emits a serialized text token into the output stream. */
    emitText({ text }) {
        this.push(!this.parserFeedbackSimulator.inForeignContent &&
            html.hasUnescapedText(this.tokenizer.lastStartTagName, true)
            ? text
            : escapeText(text));
    }
    /** Emits a serialized comment token into the output stream. */
    emitComment(token) {
        this.push(`<!--${token.text}-->`);
    }
    /** Emits a raw HTML string into the output stream. */
    emitRaw(html) {
        this.push(html);
    }
}
