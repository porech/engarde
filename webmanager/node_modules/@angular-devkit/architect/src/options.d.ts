/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import { json } from '@angular-devkit/core';
import { BuilderInput } from './api';
type OverrideOptions = BuilderInput['options'];
export declare function mergeOptions(baseOptions: json.JsonObject, overrideOptions: OverrideOptions): json.JsonObject;
export {};
