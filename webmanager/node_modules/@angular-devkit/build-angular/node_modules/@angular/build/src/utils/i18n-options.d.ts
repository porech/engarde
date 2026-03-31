/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import type { TranslationLoader } from './load-translations';
export interface LocaleDescription {
    files: {
        path: string;
        integrity?: string;
        format?: string;
    }[];
    translation?: Record<string, unknown>;
    dataPath?: string;
    baseHref?: string;
    subPath: string;
}
export interface I18nOptions {
    inlineLocales: Set<string>;
    sourceLocale: string;
    locales: Record<string, LocaleDescription>;
    flatOutput?: boolean;
    readonly shouldInline: boolean;
    hasDefinedSourceLocale?: boolean;
}
export declare function createI18nOptions(projectMetadata: {
    i18n?: unknown;
}, inline?: boolean | string[], logger?: {
    warn(message: string): void;
}, ssrEnabled?: boolean): I18nOptions;
export declare function loadTranslations(locale: string, desc: LocaleDescription, workspaceRoot: string, loader: TranslationLoader, logger: {
    warn: (message: string) => void;
    error: (message: string) => void;
}, usedFormats?: Set<string>, duplicateTranslation?: 'ignore' | 'error' | 'warning'): void;
