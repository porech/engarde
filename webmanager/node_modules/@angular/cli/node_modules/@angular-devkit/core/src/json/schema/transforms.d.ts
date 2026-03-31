/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import { JsonValue } from '../utils';
import { JsonPointer } from './interface';
import { JsonSchema } from './schema';
export declare function addUndefinedObjectDefaults(value: JsonValue, _pointer: JsonPointer, schema?: JsonSchema): JsonValue;
export declare function addUndefinedDefaults(value: JsonValue, _pointer: JsonPointer, schema?: JsonSchema): JsonValue;
