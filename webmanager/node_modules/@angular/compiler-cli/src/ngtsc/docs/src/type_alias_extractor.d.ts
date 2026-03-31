/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import ts from 'typescript';
import { EntryType } from './entities';
/** Extract the documentation entry for a type alias. */
export declare function extractTypeAlias(declaration: ts.TypeAliasDeclaration): {
    name: string;
    type: string;
    entryType: EntryType;
    generics: import("./entities").GenericEntry[];
    rawComment: string;
    description: string;
    jsdocTags: import("./entities").JsDocTagEntry[];
};
