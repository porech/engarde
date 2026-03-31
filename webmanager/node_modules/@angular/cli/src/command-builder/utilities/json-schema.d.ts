/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import { json } from '@angular-devkit/core';
import type { Argv, Options as YargsOptions } from 'yargs';
import { EventCustomDimension } from '../../analytics/analytics-parameters';
/**
 * An option description.
 */
export interface Option extends YargsOptions {
    /**
     * The name of the option.
     */
    name: string;
    /**
     * Whether this option is required or not.
     */
    required?: boolean;
    /**
     * Format field of this option.
     */
    format?: string;
    /**
     * Whether this option should be hidden from the help output. It will still show up in JSON help.
     */
    hidden?: boolean;
    /**
     * If this option can be used as an argument, the position of the argument. Otherwise omitted.
     */
    positional?: number;
    /**
     * Whether or not to report this option to the Angular Team, and which custom field to use.
     * If this is falsey, do not report this option.
     */
    userAnalytics?: string;
    /**
     * Type of the values in a key/value pair field.
     */
    itemValueType?: 'string';
}
export declare function parseJsonSchemaToOptions(registry: json.schema.SchemaRegistry, schema: json.JsonObject, interactive?: boolean): Promise<Option[]>;
/**
 * Adds schema options to a command also this keeps track of options that are required for analytics.
 * **Note:** This method should be called from the command bundler method.
 *
 * @returns A map from option name to analytics configuration.
 */
export declare function addSchemaOptionsToCommand<T>(localYargs: Argv<T>, options: Option[], includeDefaultValues: boolean): Map<string, EventCustomDimension>;
