/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import { BuildOutputFile } from './bundler-context';
/**
 * Inlining options that should apply to all transformed code.
 */
export interface I18nInlinerOptions {
    missingTranslation: 'error' | 'warning' | 'ignore';
    outputFiles: BuildOutputFile[];
    shouldOptimize?: boolean;
    persistentCachePath?: string;
}
/**
 * A class that performs i18n translation inlining of JavaScript code.
 * A worker pool is used to distribute the transformation actions and allow
 * parallel processing. Inlining is only performed on code that contains the
 * localize function (`$localize`).
 */
export declare class I18nInliner {
    #private;
    private readonly options;
    constructor(options: I18nInlinerOptions, maxThreads?: number);
    /**
     * Performs inlining of translations for the provided locale and translations. The files that
     * are processed originate from the files passed to the class constructor and filter by presence
     * of the localize function keyword.
     * @param locale The string representing the locale to inline.
     * @param translation The translation messages to use when inlining.
     * @returns A promise that resolves to an array of OutputFiles representing a translated result.
     */
    inlineForLocale(locale: string, translation: Record<string, unknown> | undefined): Promise<{
        outputFiles: BuildOutputFile[];
        errors: string[];
        warnings: string[];
    }>;
    inlineTemplateUpdate(locale: string, translation: Record<string, unknown> | undefined, templateCode: string, templateId: string): Promise<{
        code: string;
        errors: string[];
        warnings: string[];
    }>;
    /**
     * Stops all active transformation tasks and shuts down all workers.
     * @returns A void promise that resolves when closing is complete.
     */
    close(): Promise<void>;
    /**
     * Initializes the cache for storing translated bundles.
     * If the cache is already initialized, it does nothing.
     *
     * @returns A promise that resolves once the cache initialization process is complete.
     */
    private initCache;
}
