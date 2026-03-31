/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import { type I18nOptions } from '@angular/build/private';
import { type DiagnosticHandlingStrategy } from '@angular/localize/tools';
import { BuilderContext } from '@angular-devkit/architect';
import { Schema as ExtractI18nOptions, Format } from './schema';
export type NormalizedExtractI18nOptions = Awaited<ReturnType<typeof normalizeOptions>>;
/**
 * Normalize the user provided options by creating full paths for all path based options
 * and converting multi-form options into a single form that can be directly used
 * by the build process.
 *
 * @param context The context for current builder execution.
 * @param projectName The name of the project for the current execution.
 * @param options An object containing the options to use for the build.
 * @returns An object containing normalized options required to perform the build.
 */
export declare function normalizeOptions(context: BuilderContext, projectName: string, options: ExtractI18nOptions): Promise<{
    workspaceRoot: string;
    projectRoot: string;
    buildTarget: import("@angular-devkit/architect").Target;
    i18nOptions: I18nOptions & {
        duplicateTranslationBehavior: DiagnosticHandlingStrategy;
    };
    format: Format.Arb | Format.Json | Format.LegacyMigrate | Format.Xliff | Format.Xliff2 | Format.Xmb;
    outFile: string;
    progress: boolean;
}>;
