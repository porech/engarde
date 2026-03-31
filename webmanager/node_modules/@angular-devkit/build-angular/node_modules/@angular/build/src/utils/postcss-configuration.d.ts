/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
export interface PostcssConfiguration {
    plugins: [name: string, options?: object | string][];
}
export interface SearchDirectory {
    root: string;
    files: Set<string>;
}
export declare function generateSearchDirectories(roots: string[]): Promise<SearchDirectory[]>;
export declare function findTailwindConfiguration(searchDirectories: SearchDirectory[]): string | undefined;
export declare function loadPostcssConfiguration(searchDirectories: SearchDirectory[]): Promise<PostcssConfiguration | undefined>;
