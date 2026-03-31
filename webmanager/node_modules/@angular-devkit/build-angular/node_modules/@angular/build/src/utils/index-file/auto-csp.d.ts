/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
/**
 * Calculates a CSP compatible hash of an inline script.
 * @param scriptText Text between opening and closing script tag. Has to
 *     include whitespaces and newlines!
 * @returns The hash of the text formatted appropriately for CSP.
 */
export declare function hashTextContent(scriptText: string): string;
/**
 * Finds all `<script>` tags and creates a dynamic script loading block for consecutive `<script>` with `src` attributes.
 * Hashes all scripts, both inline and generated dynamic script loading blocks.
 * Inserts a `<meta>` tag at the end of the `<head>` of the document with the generated hash-based CSP.
 *
 * @param html Markup that should be processed.
 * @returns The transformed HTML that contains the `<meta>` tag CSP and dynamic loader scripts.
 */
export declare function autoCsp(html: string, unsafeEval?: boolean): Promise<string>;
