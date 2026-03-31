/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import * as o from '@angular/compiler';
import ts from 'typescript';
import { ReferenceEmitter } from '../../imports';
import { ReflectionHost } from '../../reflection';
import { ImportManager } from './import_manager/import_manager';
export declare function translateType(type: o.Type, contextFile: ts.SourceFile, reflector: ReflectionHost, refEmitter: ReferenceEmitter, imports: ImportManager): ts.TypeNode;
