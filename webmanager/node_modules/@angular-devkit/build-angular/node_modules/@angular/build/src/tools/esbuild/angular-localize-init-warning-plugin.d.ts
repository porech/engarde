/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import type { Plugin } from 'esbuild';
/**
 * This plugin addresses an issue where '@angular/localize/init' is directly imported,
 * potentially resulting in undefined behavior. By detecting such imports, the plugin
 * issues a warning and suggests including '@angular/localize/init' as a polyfill.
 *
 * @returns An esbuild plugin.
 */
export declare function createAngularLocalizeInitWarningPlugin(): Plugin;
