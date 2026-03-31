/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import type { Plugin } from 'esbuild';
/**
 * The internal namespace used by generated locale import statements and Angular locale data plugin.
 */
export declare const LOCALE_DATA_NAMESPACE = "angular:locale/data";
/**
 * The base module location used to search for locale specific data.
 */
export declare const LOCALE_DATA_BASE_MODULE = "@angular/common/locales/global";
/**
 * Creates an esbuild plugin that resolves Angular locale data files from `@angular/common`.
 *
 * @returns An esbuild plugin.
 */
export declare function createAngularLocaleDataPlugin(): Plugin;
