/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import { Argv } from 'yargs';
interface JsonHelpOption {
    name: string;
    type?: string;
    deprecated: boolean | string;
    aliases?: string[];
    default?: string;
    required?: boolean;
    positional?: number;
    enum?: string[];
    description?: string;
}
interface JsonHelpDescription {
    shortDescription?: string;
    longDescription?: string;
    longDescriptionRelativePath?: string;
}
interface JsonHelpSubcommand extends JsonHelpDescription {
    name: string;
    aliases: string[];
    deprecated: string | boolean;
}
export interface JsonHelp extends JsonHelpDescription {
    name: string;
    command: string;
    options: JsonHelpOption[];
    subcommands?: JsonHelpSubcommand[];
}
export declare function jsonHelpUsage(localYargs: Argv): string;
export {};
