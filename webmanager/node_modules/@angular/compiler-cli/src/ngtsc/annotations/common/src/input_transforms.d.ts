/*!
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import { ClassPropertyMapping, InputMapping } from '../../../metadata';
import { CompileResult } from '../../../transform';
/** Generates additional fields to be added to a class that has inputs with transform functions. */
export declare function compileInputTransformFields(inputs: ClassPropertyMapping<InputMapping>): CompileResult[];
