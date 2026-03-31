/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
/**
 * The options passed to the inliner for each file request
 */
interface InlineFileRequest {
    /**
     * The filename that should be processed. The data for the file is provided to the Worker
     * during Worker initialization.
     */
    filename: string;
    /**
     * The locale specifier that should be used during the inlining process of the file.
     */
    locale: string;
    /**
     * The translation messages for the locale that should be used during the inlining process of the file.
     */
    translation?: Record<string, unknown>;
}
/**
 * The options passed to the inliner for each code request
 */
interface InlineCodeRequest {
    /**
     * The code that should be processed.
     */
    code: string;
    /**
     * The filename to use in error and warning messages for the provided code.
     */
    filename: string;
    /**
     * The locale specifier that should be used during the inlining process of the file.
     */
    locale: string;
    /**
     * The translation messages for the locale that should be used during the inlining process of the file.
     */
    translation?: Record<string, unknown>;
}
/**
 * Inlines the provided locale and translation into a JavaScript file that contains `$localize` usage.
 * This function is the main entry for the Worker's action that is called by the worker pool.
 *
 * @param request An InlineRequest object representing the options for inlining
 * @returns An object containing the inlined file and optional map content.
 */
export default function inlineFile(request: InlineFileRequest): Promise<{
    file: string;
    code: string;
    map: string | undefined;
    messages: {
        type: "warning" | "error";
        message: string;
    }[];
}>;
/**
 * Inlines the provided locale and translation into JavaScript code that contains `$localize` usage.
 * This function is a secondary entry primarily for use with component HMR update modules.
 *
 * @param request An InlineRequest object representing the options for inlining
 * @returns An object containing the inlined code.
 */
export declare function inlineCode(request: InlineCodeRequest): Promise<{
    output: string;
    messages: {
        type: "warning" | "error";
        message: string;
    }[];
}>;
export {};
