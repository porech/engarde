/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import type { CompileResult, Deprecation, SourceSpan, StringOptions } from 'sass';
export interface SerializableVersion {
    major: number;
    minor: number;
    patch: number;
}
export interface SerializableDeprecation extends Omit<Deprecation, 'obsoleteIn' | 'deprecatedIn'> {
    /** The version this deprecation first became active in. */
    deprecatedIn: SerializableVersion | null;
    /** The version this deprecation became obsolete in. */
    obsoleteIn: SerializableVersion | null;
}
export type SerializableWarningMessage = ({
    deprecation: true;
    deprecationType: SerializableDeprecation;
} | {
    deprecation: false;
}) & {
    message: string;
    span?: Omit<SourceSpan, 'url'> & {
        url?: string;
    };
    stack?: string;
};
/**
 * A Sass renderer implementation that provides an interface that can be used by Webpack's
 * `sass-loader`. The implementation uses a Worker thread to perform the Sass rendering
 * with the `dart-sass` package.  The `dart-sass` synchronous render function is used within
 * the worker which can be up to two times faster than the asynchronous variant.
 */
export declare class SassWorkerImplementation {
    #private;
    private readonly rebase;
    readonly maxThreads: number;
    constructor(rebase?: boolean, maxThreads?: number);
    /**
     * Provides information about the Sass implementation.
     * This mimics enough of the `dart-sass` value to be used with the `sass-loader`.
     */
    get info(): string;
    /**
     * The synchronous render function is not used by the `sass-loader`.
     */
    compileString(): never;
    /**
     * Asynchronously request a Sass stylesheet to be renderered.
     *
     * @param source The contents to compile.
     * @param options The `dart-sass` options to use when rendering the stylesheet.
     */
    compileStringAsync(source: string, options: StringOptions<'async'>): Promise<CompileResult>;
    /**
     * Shutdown the Sass render worker.
     * Executing this method will stop any pending render requests.
     * @returns A void promise that resolves when closing is complete.
     */
    close(): Promise<void>;
    private processImporters;
    private isFileImporter;
}
