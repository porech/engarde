"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.execute = execute;
const node_fs_1 = __importDefault(require("node:fs"));
const node_path_1 = __importDefault(require("node:path"));
const load_esm_1 = require("../../utils/load-esm");
const version_1 = require("../../utils/version");
const options_1 = require("./options");
const schema_1 = require("./schema");
/**
 * @experimental Direct usage of this function is considered experimental.
 */
async function execute(options, context, extensions) {
    // Determine project name from builder context target
    const projectName = context.target?.project;
    if (!projectName) {
        context.logger.error(`The 'extract-i18n' builder requires a target to be specified.`);
        return { success: false };
    }
    const { projectType } = (await context.getProjectMetadata(projectName));
    if (projectType !== 'application') {
        context.logger.error(`Tried to extract from ${projectName} with 'projectType' ${projectType}, which is not supported.` +
            ` The 'extract-i18n' builder can only extract from applications.`);
        return { success: false };
    }
    // Check Angular version.
    (0, version_1.assertCompatibleAngularVersion)(context.workspaceRoot);
    // Load the Angular localize package.
    // The package is a peer dependency and might not be present
    let localizeToolsModule;
    try {
        localizeToolsModule =
            await (0, load_esm_1.loadEsmModule)('@angular/localize/tools');
    }
    catch {
        return {
            success: false,
            error: `i18n extraction requires the '@angular/localize' package.` +
                ` You can add it by using 'ng add @angular/localize'.`,
        };
    }
    // Normalize options
    const normalizedOptions = await (0, options_1.normalizeOptions)(context, projectName, options);
    const builderName = await context.getBuilderNameForTarget(normalizedOptions.buildTarget);
    // Extract messages based on configured builder
    const { extractMessages } = await Promise.resolve().then(() => __importStar(require('./application-extraction')));
    const extractionResult = await extractMessages(normalizedOptions, builderName, context, localizeToolsModule.MessageExtractor, extensions);
    if (!extractionResult.success) {
        return { success: false };
    }
    // Perform duplicate message checks
    const { checkDuplicateMessages } = localizeToolsModule;
    // The filesystem is used to create a relative path for each file
    // from the basePath.  This relative path is then used in the error message.
    const checkFileSystem = {
        relative(from, to) {
            return node_path_1.default.relative(from, to);
        },
    };
    const duplicateTranslationBehavior = normalizedOptions.i18nOptions.duplicateTranslationBehavior;
    const diagnostics = checkDuplicateMessages(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    checkFileSystem, extractionResult.messages, duplicateTranslationBehavior, 
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    extractionResult.basePath);
    if (diagnostics.messages.length > 0 && duplicateTranslationBehavior !== 'ignore') {
        if (duplicateTranslationBehavior === 'error') {
            context.logger.error(`Extraction Failed: ${diagnostics.formatDiagnostics('')}`);
            return { success: false };
        }
        else {
            context.logger.warn(diagnostics.formatDiagnostics(''));
        }
    }
    // Serialize all extracted messages
    const serializer = await createSerializer(localizeToolsModule, normalizedOptions.format, normalizedOptions.i18nOptions.sourceLocale, extractionResult.basePath, extractionResult.useLegacyIds, diagnostics);
    const content = serializer.serialize(extractionResult.messages);
    // Ensure directory exists
    const outputPath = node_path_1.default.dirname(normalizedOptions.outFile);
    if (!node_fs_1.default.existsSync(outputPath)) {
        node_fs_1.default.mkdirSync(outputPath, { recursive: true });
    }
    // Write translation file
    node_fs_1.default.writeFileSync(normalizedOptions.outFile, content);
    if (normalizedOptions.progress) {
        context.logger.info(`Extraction Complete. (Messages: ${extractionResult.messages.length})`);
    }
    return { success: true, outputPath: normalizedOptions.outFile };
}
async function createSerializer(localizeToolsModule, format, sourceLocale, basePath, useLegacyIds, diagnostics) {
    const { XmbTranslationSerializer, LegacyMessageIdMigrationSerializer, ArbTranslationSerializer, Xliff1TranslationSerializer, Xliff2TranslationSerializer, SimpleJsonTranslationSerializer, } = localizeToolsModule;
    switch (format) {
        case schema_1.Format.Xmb:
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            return new XmbTranslationSerializer(basePath, useLegacyIds);
        case schema_1.Format.Xlf:
        case schema_1.Format.Xlif:
        case schema_1.Format.Xliff:
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            return new Xliff1TranslationSerializer(sourceLocale, basePath, useLegacyIds, {});
        case schema_1.Format.Xlf2:
        case schema_1.Format.Xliff2:
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            return new Xliff2TranslationSerializer(sourceLocale, basePath, useLegacyIds, {});
        case schema_1.Format.Json:
            return new SimpleJsonTranslationSerializer(sourceLocale);
        case schema_1.Format.LegacyMigrate:
            return new LegacyMessageIdMigrationSerializer(diagnostics);
        case schema_1.Format.Arb:
            return new ArbTranslationSerializer(sourceLocale, 
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            basePath, {
                relative(from, to) {
                    return node_path_1.default.relative(from, to);
                },
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            });
    }
}
