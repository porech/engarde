/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
export declare function normalizePath(path: string): string;
declare function externalizeForWindows(path: string): string;
export declare const externalizePath: typeof externalizeForWindows;
export {};
