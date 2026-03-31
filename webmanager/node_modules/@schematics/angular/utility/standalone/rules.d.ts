/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import { Rule } from '@angular-devkit/schematics';
import { CodeBlockCallback } from './code_block';
/**
 * Adds an import to the root of the project.
 * @param project Name of the project to which to add the import.
 * @param callback Function that generates the code block which should be inserted.
 * @example
 *
 * ```ts
 * import { Rule } from '@angular-devkit/schematics';
 * import { addRootImport } from '@schematics/angular/utility';
 *
 * export default function(): Rule {
 *   return addRootImport('default', ({code, external}) => {
 *     return code`${external('MyModule', '@my/module')}.forRoot({})`;
 *   });
 * }
 * ```
 */
export declare function addRootImport(project: string, callback: CodeBlockCallback): Rule;
/**
 * Adds a provider to the root of the project.
 * @param project Name of the project to which to add the import.
 * @param callback Function that generates the code block which should be inserted.
 * @example
 *
 * ```ts
 * import { Rule } from '@angular-devkit/schematics';
 * import { addRootProvider } from '@schematics/angular/utility';
 *
 * export default function(): Rule {
 *   return addRootProvider('default', ({code, external}) => {
 *     return code`${external('provideLibrary', '@my/library')}({})`;
 *   });
 * }
 * ```
 */
export declare function addRootProvider(project: string, callback: CodeBlockCallback): Rule;
