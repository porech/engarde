/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import { Rule } from '@angular-devkit/schematics';
export interface DeclarationToNgModuleOptions {
    module?: string;
    path?: string;
    name: string;
    flat?: boolean;
    export?: boolean;
    type: string;
    typeSeparator?: '.' | '-';
    skipImport?: boolean;
    standalone?: boolean;
}
export declare function addDeclarationToNgModule(options: DeclarationToNgModuleOptions): Rule;
