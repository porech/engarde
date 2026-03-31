"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.inlineI18n = inlineI18n;
exports.loadActiveTranslations = loadActiveTranslations;
const node_path_1 = require("node:path");
const bundler_context_1 = require("../../tools/esbuild/bundler-context");
const i18n_inliner_1 = require("../../tools/esbuild/i18n-inliner");
const environment_options_1 = require("../../utils/environment-options");
const i18n_options_1 = require("../../utils/i18n-options");
const load_translations_1 = require("../../utils/load-translations");
const execute_post_bundle_1 = require("./execute-post-bundle");
const options_1 = require("./options");
/**
 * Inlines all active locales as specified by the application build options into all
 * application JavaScript files created during the build.
 * @param metafile An esbuild metafile object.
 * @param options The normalized application builder options used to create the build.
 * @param executionResult The result of an executed build.
 * @param initialFiles A map containing initial file information for the executed build.
 */
async function inlineI18n(metafile, options, executionResult, initialFiles) {
    const { i18nOptions, optimizationOptions, baseHref, cacheOptions } = options;
    // Create the multi-threaded inliner with common options and the files generated from the build.
    const inliner = new i18n_inliner_1.I18nInliner({
        missingTranslation: i18nOptions.missingTranslationBehavior ?? 'warning',
        outputFiles: executionResult.outputFiles,
        shouldOptimize: optimizationOptions.scripts,
        persistentCachePath: cacheOptions.enabled ? cacheOptions.path : undefined,
    }, environment_options_1.maxWorkers);
    const inlineResult = {
        errors: [],
        warnings: [],
        prerenderedRoutes: {},
    };
    // For each active locale, use the inliner to process the output files of the build.
    const updatedOutputFiles = [];
    const updatedAssetFiles = [];
    // Root and SSR entry files are not modified.
    const unModifiedOutputFiles = executionResult.outputFiles.filter(({ type }) => type === bundler_context_1.BuildOutputFileType.Root || type === bundler_context_1.BuildOutputFileType.ServerRoot);
    try {
        for (const locale of i18nOptions.inlineLocales) {
            // A locale specific set of files is returned from the inliner.
            const localeInlineResult = await inliner.inlineForLocale(locale, i18nOptions.locales[locale].translation);
            const localeOutputFiles = localeInlineResult.outputFiles;
            inlineResult.errors.push(...localeInlineResult.errors);
            inlineResult.warnings.push(...localeInlineResult.warnings);
            const { errors, warnings, additionalAssets, additionalOutputFiles, prerenderedRoutes: generatedRoutes, } = await (0, execute_post_bundle_1.executePostBundleSteps)(metafile, {
                ...options,
                baseHref: (0, options_1.getLocaleBaseHref)(baseHref, i18nOptions, locale) ?? baseHref,
            }, [...unModifiedOutputFiles, ...localeOutputFiles], executionResult.assetFiles, initialFiles, locale);
            localeOutputFiles.push(...additionalOutputFiles);
            inlineResult.errors.push(...errors);
            inlineResult.warnings.push(...warnings);
            // Update directory with locale base or subPath
            const subPath = i18nOptions.locales[locale].subPath;
            if (i18nOptions.flatOutput !== true) {
                localeOutputFiles.forEach((file) => {
                    file.path = (0, node_path_1.join)(subPath, file.path);
                });
                for (const assetFile of [...executionResult.assetFiles, ...additionalAssets]) {
                    updatedAssetFiles.push({
                        source: assetFile.source,
                        destination: (0, node_path_1.join)(subPath, assetFile.destination),
                    });
                }
            }
            else {
                executionResult.assetFiles.push(...additionalAssets);
            }
            inlineResult.prerenderedRoutes = { ...inlineResult.prerenderedRoutes, ...generatedRoutes };
            updatedOutputFiles.push(...localeOutputFiles);
        }
    }
    finally {
        await inliner.close();
    }
    // Update the result with all localized files.
    executionResult.outputFiles = [
        // Root and SSR entry files are not modified.
        ...unModifiedOutputFiles,
        // Updated files for each locale.
        ...updatedOutputFiles,
    ];
    // Assets are only changed if not using the flat output option
    if (!i18nOptions.flatOutput) {
        executionResult.assetFiles = updatedAssetFiles;
    }
    // Inline any template updates if present
    if (executionResult.templateUpdates?.size) {
        // The development server only allows a single locale but issue a warning if used programmatically (experimental)
        // with multiple locales and template HMR.
        if (i18nOptions.inlineLocales.size > 1) {
            inlineResult.warnings.push(`Component HMR updates can only be inlined with a single locale. The first locale will be used.`);
        }
        const firstLocale = [...i18nOptions.inlineLocales][0];
        for (const [id, content] of executionResult.templateUpdates) {
            const templateUpdateResult = await inliner.inlineTemplateUpdate(firstLocale, i18nOptions.locales[firstLocale].translation, content, id);
            executionResult.templateUpdates.set(id, templateUpdateResult.code);
            inlineResult.errors.push(...templateUpdateResult.errors);
            inlineResult.warnings.push(...templateUpdateResult.warnings);
        }
    }
    return inlineResult;
}
/**
 * Loads all active translations using the translation loaders from the `@angular/localize` package.
 * @param context The architect builder context for the current build.
 * @param i18n The normalized i18n options to use.
 */
async function loadActiveTranslations(context, i18n) {
    // Load locale data and translations (if present)
    let loader;
    for (const [locale, desc] of Object.entries(i18n.locales)) {
        if (!i18n.inlineLocales.has(locale) && locale !== i18n.sourceLocale) {
            continue;
        }
        if (!desc.files.length) {
            continue;
        }
        loader ??= await (0, load_translations_1.createTranslationLoader)();
        (0, i18n_options_1.loadTranslations)(locale, desc, context.workspaceRoot, loader, {
            warn(message) {
                context.logger.warn(message);
            },
            error(message) {
                throw new Error(message);
            },
        }, undefined, i18n.duplicateTranslationBehavior);
    }
}
