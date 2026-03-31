import { Transform } from 'node:stream';
import { DevNullStream } from './dev-null-stream.js';
import { ParserFeedbackSimulator } from './parser-feedback-simulator.js';
/**
 * Streaming [SAX](https://en.wikipedia.org/wiki/Simple_API_for_XML)-style HTML parser.
 * A [transform stream](https://nodejs.org/api/stream.html#stream_class_stream_transform) (which means you can pipe _through_ it, see example).
 *
 * @example
 *
 * ```js
 *     const SAXParser = require('parse5-sax-parser');
 *     const http = require('http');
 *     const fs = require('fs');
 *
 *     const file = fs.createWriteStream('/home/google.com.html');
 *     const parser = new SAXParser();
 *
 *     parser.on('text', text => {
 *        // Handle page text content
 *        ...
 *     });
 *
 *     http.get('http://google.com', res => {
 *        // `SAXParser` is the `Transform` stream, which means you can pipe
 *        // through it. So, you can analyze the page content and, e.g., save it
 *        // to the file at the same time:
 *        res.pipe(parser).pipe(file);
 *     });
 * ```
 */
export class SAXParser extends Transform {
    /**
     * @param options Parsing options.
     */
    constructor(options = {}) {
        super({ encoding: 'utf8', decodeStrings: false });
        this.pendingText = null;
        this.lastChunkWritten = false;
        this.stopped = false;
        this.options = {
            sourceCodeLocationInfo: false,
            ...options,
        };
        this.parserFeedbackSimulator = new ParserFeedbackSimulator(this.options, this);
        this.tokenizer = this.parserFeedbackSimulator.tokenizer;
        // NOTE: always pipe the stream to the /dev/null stream to avoid
        // the `highWaterMark` to be hit even if we don't have consumers.
        // (see: https://github.com/inikulin/parse5/issues/97#issuecomment-171940774)
        this.pipe(new DevNullStream());
    }
    //`Transform` implementation
    _transform(chunk, _encoding, callback) {
        if (typeof chunk !== 'string') {
            throw new TypeError('Parser can work only with string streams.');
        }
        callback(null, this._transformChunk(chunk));
    }
    _final(callback) {
        this.lastChunkWritten = true;
        callback(null, this._transformChunk(''));
    }
    /**
     * Stops parsing. Useful if you want the parser to stop consuming CPU time
     * once you've obtained the desired info from the input stream. Doesn't
     * prevent piping, so that data will flow through the parser as usual.
     *
     * @example
     *
     * ```js
     * const SAXParser = require('parse5-sax-parser');
     * const http = require('http');
     * const fs = require('fs');
     *
     * const file = fs.createWriteStream('google.com.html');
     * const parser = new SAXParser();
     *
     * parser.on('doctype', ({ name, publicId, systemId }) => {
     *     // Process doctype info and stop parsing
     *     ...
     *     parser.stop();
     * });
     *
     * http.get('http://google.com', res => {
     *     // Despite the fact that parser.stop() was called whole
     *     // content of the page will be written to the file
     *     res.pipe(parser).pipe(file);
     * });
     * ```
     */
    stop() {
        this.stopped = true;
        this.tokenizer.pause();
    }
    //Internals
    _transformChunk(chunk) {
        if (!this.stopped) {
            this.tokenizer.write(chunk, this.lastChunkWritten);
        }
        return chunk;
    }
    /** @internal */
    onCharacter({ chars, location }) {
        if (this.pendingText === null) {
            this.pendingText = { text: chars, sourceCodeLocation: location };
        }
        else {
            this.pendingText.text += chars;
            if (location && this.pendingText.sourceCodeLocation) {
                const { endLine, endCol, endOffset } = location;
                this.pendingText.sourceCodeLocation = {
                    ...this.pendingText.sourceCodeLocation,
                    endLine,
                    endCol,
                    endOffset,
                };
            }
        }
        if (this.tokenizer.preprocessor.willDropParsedChunk()) {
            this._emitPendingText();
        }
    }
    /** @internal */
    onWhitespaceCharacter(token) {
        this.onCharacter(token);
    }
    /** @internal */
    onNullCharacter(token) {
        this.onCharacter(token);
    }
    /** @internal */
    onEof() {
        this._emitPendingText();
        this.stopped = true;
    }
    /** @internal */
    onStartTag(token) {
        this._emitPendingText();
        const startTag = {
            tagName: token.tagName,
            attrs: token.attrs,
            selfClosing: token.selfClosing,
            sourceCodeLocation: token.location,
        };
        this.emitIfListenerExists('startTag', startTag);
    }
    /** @internal */
    onEndTag(token) {
        this._emitPendingText();
        const endTag = {
            tagName: token.tagName,
            sourceCodeLocation: token.location,
        };
        this.emitIfListenerExists('endTag', endTag);
    }
    /** @internal */
    onDoctype(token) {
        this._emitPendingText();
        const doctype = {
            name: token.name,
            publicId: token.publicId,
            systemId: token.systemId,
            sourceCodeLocation: token.location,
        };
        this.emitIfListenerExists('doctype', doctype);
    }
    /** @internal */
    onComment(token) {
        this._emitPendingText();
        const comment = {
            text: token.data,
            sourceCodeLocation: token.location,
        };
        this.emitIfListenerExists('comment', comment);
    }
    emitIfListenerExists(eventName, token) {
        if (this.listenerCount(eventName) === 0) {
            return false;
        }
        this._emitToken(eventName, token);
        return true;
    }
    _emitToken(eventName, token) {
        this.emit(eventName, token);
    }
    _emitPendingText() {
        if (this.pendingText !== null) {
            this.emitIfListenerExists('text', this.pendingText);
            this.pendingText = null;
        }
    }
}
