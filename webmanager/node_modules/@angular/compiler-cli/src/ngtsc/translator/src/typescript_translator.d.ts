/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import * as o from '@angular/compiler';
import ts from 'typescript';
import { ImportGenerator } from './api/import_generator';
import { TranslatorOptions } from './translator';
export declare function translateExpression(contextFile: ts.SourceFile, expression: o.Expression, imports: ImportGenerator<ts.SourceFile, ts.Expression>, options?: TranslatorOptions<ts.Expression>): ts.Expression;
export declare function translateStatement(contextFile: ts.SourceFile, statement: o.Statement, imports: ImportGenerator<ts.SourceFile, ts.Expression>, options?: TranslatorOptions<ts.Expression>): ts.Statement;
