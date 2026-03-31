/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import type { ImportManagerConfig } from './import_manager';
/**
 * Generates a helper for `ImportManagerConfig` to generate unique identifiers
 * for a given source file.
 */
export declare function createGenerateUniqueIdentifierHelper(): ImportManagerConfig['generateUniqueIdentifier'];
