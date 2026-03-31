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
exports.buildApplicationInternal = buildApplicationInternal;
exports.buildApplication = buildApplication;
const architect_1 = require("@angular-devkit/architect");
const node_assert_1 = __importDefault(require("node:assert"));
const promises_1 = __importDefault(require("node:fs/promises"));
const node_path_1 = __importDefault(require("node:path"));
const bundler_context_1 = require("../../tools/esbuild/bundler-context");
const utils_1 = require("../../tools/esbuild/utils");
const color_1 = require("../../utils/color");
const delete_output_dir_1 = require("../../utils/delete-output-dir");
const environment_options_1 = require("../../utils/environment-options");
const purge_cache_1 = require("../../utils/purge-cache");
const version_1 = require("../../utils/version");
const build_action_1 = require("./build-action");
const execute_build_1 = require("./execute-build");
const options_1 = require("./options");
const results_1 = require("./results");
const isNodeV22orHigher = Number(process.versions.node.split('.', 1)[0]) >= 22;
async function* buildApplicationInternal(options, 
// TODO: Integrate abort signal support into builder system
context, extensions) {
    const { workspaceRoot, logger, target } = context;
    // Check Angular version.
    (0, version_1.assertCompatibleAngularVersion)(workspaceRoot);
    // Purge old build disk cache.
    await (0, purge_cache_1.purgeStaleBuildCache)(context);
    // Determine project name from builder context target
    const projectName = target?.project;
    if (!projectName) {
        context.logger.error(`The 'application' builder requires a target to be specified.`);
        // Only the vite-based dev server current uses the errors value
        yield { kind: results_1.ResultKind.Failure, errors: [] };
        return;
    }
    const normalizedOptions = await (0, options_1.normalizeOptions)(context, projectName, options, extensions);
    if (!normalizedOptions.outputOptions.ignoreServer) {
        const { browser, server } = normalizedOptions.outputOptions;
        if (browser === '') {
            context.logger.error(`'outputPath.browser' cannot be configured to an empty string when SSR is enabled.`);
            yield { kind: results_1.ResultKind.Failure, errors: [] };
            return;
        }
        if (browser === server) {
            context.logger.error(`'outputPath.browser' and 'outputPath.server' cannot be configured to the same value.`);
            yield { kind: results_1.ResultKind.Failure, errors: [] };
            return;
        }
    }
    // Setup an abort controller with a builder teardown if no signal is present
    let signal = context.signal;
    if (!signal) {
        const controller = new AbortController();
        signal = controller.signal;
        context.addTeardown(() => controller.abort('builder-teardown'));
    }
    yield* (0, build_action_1.runEsBuildBuildAction)(async (rebuildState) => {
        const { serverEntryPoint, jsonLogs, partialSSRBuild } = normalizedOptions;
        const startTime = process.hrtime.bigint();
        const result = await (0, execute_build_1.executeBuild)(normalizedOptions, context, rebuildState);
        if (jsonLogs) {
            result.addLog(await (0, utils_1.createJsonBuildManifest)(result, normalizedOptions));
        }
        else {
            if (serverEntryPoint && !partialSSRBuild) {
                const prerenderedRoutesLength = Object.keys(result.prerenderedRoutes).length;
                let prerenderMsg = `Prerendered ${prerenderedRoutesLength} static route`;
                prerenderMsg += prerenderedRoutesLength !== 1 ? 's.' : '.';
                result.addLog(color_1.colors.magenta(prerenderMsg));
            }
            const buildTime = Number(process.hrtime.bigint() - startTime) / 10 ** 9;
            const hasError = result.errors.length > 0;
            result.addLog(`Application bundle generation ${hasError ? 'failed' : 'complete'}.` +
                ` [${buildTime.toFixed(3)} seconds] - ${new Date().toISOString()}\n`);
        }
        return result;
    }, {
        watch: normalizedOptions.watch,
        preserveSymlinks: normalizedOptions.preserveSymlinks,
        poll: normalizedOptions.poll,
        cacheOptions: normalizedOptions.cacheOptions,
        outputOptions: normalizedOptions.outputOptions,
        verbose: normalizedOptions.verbose,
        projectRoot: normalizedOptions.projectRoot,
        workspaceRoot: normalizedOptions.workspaceRoot,
        progress: normalizedOptions.progress,
        clearScreen: normalizedOptions.clearScreen,
        colors: normalizedOptions.colors,
        jsonLogs: normalizedOptions.jsonLogs,
        incrementalResults: normalizedOptions.incrementalResults,
        logger,
        signal,
    });
}
/**
 * Builds an application using the `application` builder with the provided
 * options.
 *
 * Usage of the `extensions` parameter is NOT supported and may cause unexpected
 * build output or build failures.
 *
 * @experimental Direct usage of this function is considered experimental.
 *
 * @param options The options defined by the builder's schema to use.
 * @param context An Architect builder context instance.
 * @param extensions An object contain extension points for the build.
 * @returns The build output results of the build.
 */
async function* buildApplication(options, context, extensions) {
    let initial = true;
    const internalOptions = { ...options, incrementalResults: true };
    for await (const result of buildApplicationInternal(internalOptions, context, extensions)) {
        const outputOptions = result.detail?.['outputOptions'];
        if (initial) {
            initial = false;
            // Clean the output location if requested.
            // Output options may not be present if the build failed.
            if (outputOptions?.clean) {
                await (0, delete_output_dir_1.deleteOutputDir)(context.workspaceRoot, outputOptions.base, [
                    outputOptions.browser,
                    outputOptions.server,
                ]);
            }
        }
        if (result.kind === results_1.ResultKind.Failure) {
            yield { success: false };
            continue;
        }
        (0, node_assert_1.default)(outputOptions, 'Application output options are required for builder usage.');
        (0, node_assert_1.default)(result.kind === results_1.ResultKind.Full || result.kind === results_1.ResultKind.Incremental, 'Application build did not provide a file result output.');
        // TODO: Restructure output logging to better handle stdout JSON piping
        if (!environment_options_1.useJSONBuildLogs) {
            context.logger.info(`Output location: ${outputOptions.base}\n`);
        }
        // Writes the output files to disk and ensures the containing directories are present
        const directoryExists = new Set();
        await (0, utils_1.emitFilesToDisk)(Object.entries(result.files), async ([filePath, file]) => {
            if (outputOptions.ignoreServer &&
                (file.type === bundler_context_1.BuildOutputFileType.ServerApplication ||
                    file.type === bundler_context_1.BuildOutputFileType.ServerRoot)) {
                return;
            }
            const fullFilePath = generateFullPath(filePath, file.type, outputOptions);
            // Ensure output subdirectories exist
            const fileBasePath = node_path_1.default.dirname(fullFilePath);
            if (fileBasePath && !directoryExists.has(fileBasePath)) {
                await promises_1.default.mkdir(fileBasePath, { recursive: true });
                directoryExists.add(fileBasePath);
            }
            if (file.origin === 'memory') {
                // Write file contents
                await promises_1.default.writeFile(fullFilePath, file.contents);
            }
            else {
                // Copy file contents
                if (isNodeV22orHigher) {
                    // Use newer `cp` API on Node.js 22+ (minimum v22 for CLI is 22.11)
                    await promises_1.default.cp(file.inputPath, fullFilePath, {
                        mode: promises_1.default.constants.COPYFILE_FICLONE,
                        preserveTimestamps: true,
                    });
                }
                else {
                    // For Node.js 20 use `copyFile` (`cp` is not stable for v20)
                    // TODO: Remove when Node.js 20 is no longer supported
                    await promises_1.default.copyFile(file.inputPath, fullFilePath, promises_1.default.constants.COPYFILE_FICLONE);
                }
            }
        });
        // Delete any removed files if incremental
        if (result.kind === results_1.ResultKind.Incremental && result.removed?.length) {
            await Promise.all(result.removed.map((file) => {
                const fullFilePath = generateFullPath(file.path, file.type, outputOptions);
                return promises_1.default.rm(fullFilePath, { force: true, maxRetries: 3 });
            }));
        }
        yield { success: true };
    }
}
function generateFullPath(filePath, type, outputOptions) {
    let typeDirectory;
    switch (type) {
        case bundler_context_1.BuildOutputFileType.Browser:
        case bundler_context_1.BuildOutputFileType.Media:
            typeDirectory = outputOptions.browser;
            break;
        case bundler_context_1.BuildOutputFileType.ServerApplication:
        case bundler_context_1.BuildOutputFileType.ServerRoot:
            typeDirectory = outputOptions.server;
            break;
        case bundler_context_1.BuildOutputFileType.Root:
            typeDirectory = '';
            break;
        default:
            throw new Error(`Unhandled write for file "${filePath}" with type "${bundler_context_1.BuildOutputFileType[type]}".`);
    }
    // NOTE: 'base' is a fully resolved path at this point
    const fullFilePath = node_path_1.default.join(outputOptions.base, typeDirectory, filePath);
    return fullFilePath;
}
const builder = (0, architect_1.createBuilder)(buildApplication);
exports.default = builder;
