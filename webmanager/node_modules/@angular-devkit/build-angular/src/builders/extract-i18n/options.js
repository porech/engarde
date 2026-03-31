"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeOptions = normalizeOptions;
const private_1 = require("@angular/build/private");
const architect_1 = require("@angular-devkit/architect");
const node_assert_1 = require("node:assert");
const node_path_1 = __importDefault(require("node:path"));
const schema_1 = require("./schema");
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
async function normalizeOptions(context, projectName, options) {
    const workspaceRoot = context.workspaceRoot;
    const projectMetadata = await context.getProjectMetadata(projectName);
    const projectRoot = node_path_1.default.join(workspaceRoot, projectMetadata.root ?? '');
    // Target specifier defaults to the current project's build target with no specified configuration
    const buildTargetSpecifier = options.buildTarget ?? ':';
    const buildTarget = (0, architect_1.targetFromTargetString)(buildTargetSpecifier, projectName, 'build');
    const i18nOptions = {
        ...(0, private_1.createI18nOptions)(projectMetadata, /** inline */ false, context.logger),
        duplicateTranslationBehavior: options.i18nDuplicateTranslation || 'warning',
    };
    // Normalize xliff format extensions
    let format = options.format;
    switch (format) {
        // Default format is xliff1
        case undefined:
        case schema_1.Format.Xlf:
        case schema_1.Format.Xlif:
        case schema_1.Format.Xliff:
            format = schema_1.Format.Xliff;
            break;
        case schema_1.Format.Xlf2:
        case schema_1.Format.Xliff2:
            format = schema_1.Format.Xliff2;
            break;
    }
    let outFile = options.outFile || getDefaultOutFile(format);
    if (options.outputPath) {
        outFile = node_path_1.default.join(options.outputPath, outFile);
    }
    outFile = node_path_1.default.resolve(context.workspaceRoot, outFile);
    return {
        workspaceRoot,
        projectRoot,
        buildTarget,
        i18nOptions,
        format,
        outFile,
        progress: options.progress ?? true,
    };
}
function getDefaultOutFile(format) {
    switch (format) {
        case schema_1.Format.Xmb:
            return 'messages.xmb';
        case schema_1.Format.Xliff:
        case schema_1.Format.Xliff2:
            return 'messages.xlf';
        case schema_1.Format.Json:
        case schema_1.Format.LegacyMigrate:
            return 'messages.json';
        case schema_1.Format.Arb:
            return 'messages.arb';
        default:
            (0, node_assert_1.fail)(`Invalid Format enum value: ${format}`);
    }
}
