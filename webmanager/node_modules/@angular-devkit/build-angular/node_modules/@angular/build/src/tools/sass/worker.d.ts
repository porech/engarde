/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import { RawSourceMap } from '@ampproject/remapping';
import { MessagePort } from 'node:worker_threads';
import { SourceSpan, StringOptions } from 'sass';
import type { SerializableWarningMessage } from './sass-service';
/**
 * A request to render a Sass stylesheet using the supplied options.
 */
interface RenderRequestMessage {
    /**
     * The contents to compile.
     */
    source: string;
    /**
     * The Sass options to provide to the `dart-sass` compile function.
     */
    options: Omit<StringOptions<'sync'>, 'url'> & {
        url: string;
    };
    /**
     * Indicates the request has a custom importer function on the main thread.
     */
    importerChannel?: {
        port: MessagePort;
        signal: Int32Array;
    };
    /**
     * Indicates the request has a custom logger for warning messages.
     */
    hasLogger: boolean;
    /**
     * Indicates paths within url() CSS functions should be rebased.
     */
    rebase: boolean;
}
interface RenderResult {
    warnings: SerializableWarningMessage[] | undefined;
    result: {
        css: string;
        loadedUrls: string[];
        sourceMap?: RawSourceMap;
    };
}
interface RenderError {
    warnings: SerializableWarningMessage[] | undefined;
    error: {
        message: string;
        stack?: string;
        span?: Omit<SourceSpan, 'url'> & {
            url?: string;
        };
        sassMessage?: string;
        sassStack?: string;
    };
}
export default function renderSassStylesheet(request: RenderRequestMessage): Promise<RenderResult | RenderError>;
export {};
