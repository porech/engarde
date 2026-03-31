/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import { Schema as WtrBuilderSchema } from './schema';
/**
 * Options supported for the Web Test Runner builder. The schema is an approximate
 * representation of the options type, but this is a more precise version.
 */
export type WtrBuilderOptions = Overwrite<WtrBuilderSchema, {
    include: string[];
    exclude: string[];
    polyfills: string[];
}>;
type Overwrite<Obj extends {}, Overrides extends {}> = Omit<Obj, keyof Overrides> & Overrides;
/**
 * Normalizes input options validated by the schema to a more precise and useful
 * options type in {@link WtrBuilderOptions}.
 */
export declare function normalizeOptions(schema: WtrBuilderSchema): WtrBuilderOptions;
export {};
