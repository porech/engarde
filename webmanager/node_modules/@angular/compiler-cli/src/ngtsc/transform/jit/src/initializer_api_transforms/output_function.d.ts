/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import { PropertyTransform } from './transform_api';
/**
 * Transform that will automatically add an `@Output` decorator for all initializer API
 * outputs in Angular classes. The decorator will capture metadata of the output, such
 * as the alias.
 *
 * This transform is useful for JIT environments. In such environments, such outputs are not
 * statically retrievable at runtime. JIT compilation needs to know about all possible outputs
 * before instantiating directives. A decorator exposes this information to the class without
 * the class needing to be instantiated.
 */
export declare const initializerApiOutputTransform: PropertyTransform;
