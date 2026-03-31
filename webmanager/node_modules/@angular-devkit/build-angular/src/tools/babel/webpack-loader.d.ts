/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import { ApplicationPresetOptions } from './presets/application';
interface AngularCustomOptions extends Omit<ApplicationPresetOptions, 'instrumentCode'> {
    instrumentCode?: {
        /** node_modules and test files are always excluded. */
        excludedPaths: Set<string>;
        includedBasePath: string;
    };
}
export type AngularBabelLoaderOptions = AngularCustomOptions & Record<string, unknown>;
declare const _default: any;
export default _default;
