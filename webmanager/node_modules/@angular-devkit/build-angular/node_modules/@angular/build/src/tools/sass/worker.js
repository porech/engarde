"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = renderSassStylesheet;
const remapping_1 = __importDefault(require("@ampproject/remapping"));
const node_path_1 = require("node:path");
const node_url_1 = require("node:url");
const node_worker_threads_1 = require("node:worker_threads");
const sass_1 = require("sass");
const rebasing_importer_1 = require("./rebasing-importer");
async function renderSassStylesheet(request) {
    const { importerChannel, hasLogger, source, options, rebase } = request;
    const entryDirectory = (0, node_path_1.dirname)(options.url);
    let warnings;
    try {
        const directoryCache = new Map();
        const rebaseSourceMaps = options.sourceMap ? new Map() : undefined;
        if (importerChannel) {
            // When a custom importer function is present, the importer request must be proxied
            // back to the main thread where it can be executed.
            // This process must be synchronous from the perspective of dart-sass. The `Atomics`
            // functions combined with the shared memory `importSignal` and the Node.js
            // `receiveMessageOnPort` function are used to ensure synchronous behavior.
            const proxyImporter = {
                findFileUrl: (url, { fromImport, containingUrl }) => {
                    Atomics.store(importerChannel.signal, 0, 0);
                    importerChannel.port.postMessage({
                        url,
                        options: {
                            fromImport,
                            containingUrl: containingUrl ? (0, node_url_1.fileURLToPath)(containingUrl) : null,
                        },
                    });
                    // Wait for the main thread to set the signal to 1 and notify, which tells
                    // us that a message can be received on the port.
                    // If the main thread is fast, the signal will already be set to 1, and no
                    // sleep/notify is necessary.
                    // However, there can be a race condition here:
                    // - the main thread sets the signal to 1, but does not get to the notify instruction yet
                    // - the worker does not pause because the signal is set to 1
                    // - the worker very soon enters this method again
                    // - this method sets the signal to 0 and sends the message
                    // - the signal is 0 and so the `Atomics.wait` call blocks
                    // - only now the main thread runs the `notify` from the first invocation, so the
                    //   worker continues.
                    // - but there is no message yet in the port, because the thread should not have been
                    //   waken up yet.
                    // To combat this, wait for a non-0 value _twice_.
                    // Almost every time, this immediately continues with "not-equal", because
                    // the signal is still set to 1, except during the race condition, when the second
                    // wait will wait for the correct notify.
                    Atomics.wait(importerChannel.signal, 0, 0);
                    Atomics.wait(importerChannel.signal, 0, 0);
                    const result = (0, node_worker_threads_1.receiveMessageOnPort)(importerChannel.port)?.message;
                    return result ? (0, node_url_1.pathToFileURL)(result) : null;
                },
            };
            options.importers = [
                rebase
                    ? (0, rebasing_importer_1.sassBindWorkaround)(new rebasing_importer_1.ModuleUrlRebasingImporter(entryDirectory, directoryCache, rebaseSourceMaps, proxyImporter.findFileUrl))
                    : proxyImporter,
            ];
        }
        if (rebase && options.loadPaths?.length) {
            options.importers ??= [];
            options.importers.push((0, rebasing_importer_1.sassBindWorkaround)(new rebasing_importer_1.LoadPathsUrlRebasingImporter(entryDirectory, directoryCache, rebaseSourceMaps, options.loadPaths)));
            options.loadPaths = undefined;
        }
        let relativeImporter;
        if (rebase) {
            relativeImporter = (0, rebasing_importer_1.sassBindWorkaround)(new rebasing_importer_1.RelativeUrlRebasingImporter(entryDirectory, directoryCache, rebaseSourceMaps));
        }
        // The synchronous Sass render function can be up to two times faster than the async variant
        const result = (0, sass_1.compileString)(source, {
            ...options,
            // URL is not serializable so to convert to string in the parent and back to URL here.
            url: (0, node_url_1.pathToFileURL)(options.url),
            // The `importer` option (singular) handles relative imports
            importer: relativeImporter,
            logger: hasLogger
                ? {
                    warn(message, warnOptions) {
                        warnings ??= [];
                        warnings.push({
                            ...warnOptions,
                            message,
                            span: warnOptions.span && convertSourceSpan(warnOptions.span),
                            ...convertDeprecation(warnOptions.deprecation, 
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            warnOptions.deprecationType),
                        });
                    },
                }
                : undefined,
        });
        if (result.sourceMap && rebaseSourceMaps?.size) {
            // Merge the intermediate rebasing source maps into the final Sass generated source map.
            // Casting is required due to small but compatible differences in typings between the packages.
            result.sourceMap = (0, remapping_1.default)(result.sourceMap, 
            // To prevent an infinite lookup loop, skip getting the source when the rebasing source map
            // is referencing its original self.
            (file, context) => (file !== context.importer ? rebaseSourceMaps.get(file) : null));
        }
        return {
            warnings,
            result: {
                ...result,
                sourceMap: result.sourceMap,
                // URL is not serializable so to convert to string here and back to URL in the parent.
                loadedUrls: result.loadedUrls.map((p) => (0, node_url_1.fileURLToPath)(p)),
            },
        };
    }
    catch (error) {
        // Needed because V8 will only serialize the message and stack properties of an Error instance.
        if (error instanceof sass_1.Exception) {
            const { span, message, stack, sassMessage, sassStack } = error;
            return {
                warnings,
                error: {
                    span: convertSourceSpan(span),
                    message,
                    stack,
                    sassMessage,
                    sassStack,
                },
            };
        }
        else if (error instanceof Error) {
            const { message, stack } = error;
            return { warnings, error: { message, stack } };
        }
        else {
            return {
                warnings,
                error: { message: 'An unknown error has occurred.' },
            };
        }
    }
}
/**
 * Converts a Sass SourceSpan object into a serializable form.
 * The SourceSpan object contains a URL property which must be converted into a string.
 * Also, most of the interface's properties are get accessors and are not automatically
 * serialized when sent back from the worker.
 *
 * @param span The Sass SourceSpan object to convert.
 * @returns A serializable form of the SourceSpan object.
 */
function convertSourceSpan(span) {
    return {
        text: span.text,
        context: span.context,
        end: {
            column: span.end.column,
            offset: span.end.offset,
            line: span.end.line,
        },
        start: {
            column: span.start.column,
            offset: span.start.offset,
            line: span.start.line,
        },
        url: span.url ? (0, node_url_1.fileURLToPath)(span.url) : undefined,
    };
}
function convertDeprecation(deprecation, deprecationType) {
    if (!deprecation || !deprecationType) {
        return { deprecation: false };
    }
    const { obsoleteIn, deprecatedIn, ...rest } = deprecationType;
    return {
        deprecation: true,
        deprecationType: {
            ...rest,
            obsoleteIn: obsoleteIn
                ? {
                    major: obsoleteIn.major,
                    minor: obsoleteIn.minor,
                    patch: obsoleteIn.patch,
                }
                : null,
            deprecatedIn: deprecatedIn
                ? {
                    major: deprecatedIn.major,
                    minor: deprecatedIn.minor,
                    patch: deprecatedIn.patch,
                }
                : null,
        },
    };
}
