/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import { Builder } from '@angular-devkit/architect';
import { execute } from './builder';
import type { DevServerBuilderOutput } from './output';
import type { Schema as DevServerBuilderOptions } from './schema';
export { type DevServerBuilderOptions, type DevServerBuilderOutput, execute as executeDevServerBuilder, };
declare const builder: Builder<DevServerBuilderOptions>;
export default builder;
export { execute as executeDevServer };
