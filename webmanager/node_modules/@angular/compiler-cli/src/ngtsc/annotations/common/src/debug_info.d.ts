/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import { R3ClassDebugInfo } from '@angular/compiler';
import ts from 'typescript';
import { DeclarationNode, ReflectionHost } from '../../../reflection';
export declare function extractClassDebugInfo(clazz: DeclarationNode, reflection: ReflectionHost, compilerHost: Pick<ts.CompilerHost, 'getCanonicalFileName'>, rootDirs: ReadonlyArray<string>, forbidOrphanRendering: boolean): R3ClassDebugInfo | null;
