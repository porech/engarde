/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import type { ɵParsedMessage as LocalizeMessage } from '@angular/localize';
import type { MessageExtractor } from '@angular/localize/tools';
import type { BuilderContext } from '@angular-devkit/architect';
import type { ApplicationBuilderExtensions } from '../application/options';
import type { NormalizedExtractI18nOptions } from './options';
export declare function extractMessages(options: NormalizedExtractI18nOptions, builderName: string, context: BuilderContext, extractorConstructor: typeof MessageExtractor, extensions?: ApplicationBuilderExtensions): Promise<{
    success: boolean;
    basePath: string;
    messages: LocalizeMessage[];
    useLegacyIds: boolean;
}>;
