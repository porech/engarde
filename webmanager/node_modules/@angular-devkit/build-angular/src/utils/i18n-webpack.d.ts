/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import { type I18nOptions, loadTranslations } from '@angular/build/private';
import { BuilderContext } from '@angular-devkit/architect';
import { Schema as BrowserBuilderSchema } from '../builders/browser/schema';
import { Schema as ServerBuilderSchema } from '../builders/server/schema';
export { I18nOptions, loadTranslations };
export declare function configureI18nBuild<T extends BrowserBuilderSchema | ServerBuilderSchema>(context: BuilderContext, options: T): Promise<{
    buildOptions: T;
    i18n: I18nOptions;
}>;
