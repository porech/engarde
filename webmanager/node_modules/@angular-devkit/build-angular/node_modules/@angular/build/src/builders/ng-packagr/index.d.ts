/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import { Builder } from '@angular-devkit/architect';
import { execute } from './builder';
import type { Schema as NgPackagrBuilderOptions } from './schema';
export { type NgPackagrBuilderOptions, execute };
declare const builder: Builder<NgPackagrBuilderOptions>;
export default builder;
