/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import { PropertyTransform } from './transform_api';
/**
 * Transform that will automatically add query decorators for all signal-based
 * queries in Angular classes. The decorator will capture metadata of the signal
 * query, derived from the initializer-based API call.
 *
 * This transform is useful for JIT environments where signal queries would like to be
 * used. e.g. for Angular CLI unit testing. In such environments, signal queries are not
 * statically retrievable at runtime. JIT compilation needs to know about all possible queries
 * before instantiating directives to construct the definition. A decorator exposes this
 * information to the class without the class needing to be instantiated.
 */
export declare const queryFunctionsTransforms: PropertyTransform;
