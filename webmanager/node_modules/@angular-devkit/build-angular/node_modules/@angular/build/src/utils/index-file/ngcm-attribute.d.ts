/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
/**
 * Transforms the provided HTML by adding the `ngcm` attribute to the `<body>` tag.
 * This is used in the client-side rendered (CSR) version of `index.html` to prevent hydration warnings.
 *
 * @param html The HTML markup to be transformed.
 * @returns A promise that resolves to the transformed HTML string with the necessary modifications.
 */
export declare function addNgcmAttribute(html: string): Promise<string>;
