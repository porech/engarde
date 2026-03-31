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
exports.extractMessages = extractMessages;
const node_fs_1 = require("node:fs");
const node_path_1 = __importDefault(require("node:path"));
const application_1 = require("../application");
const results_1 = require("../application/results");
const schema_1 = require("../application/schema");
async function extractMessages(options, builderName, context, extractorConstructor, extensions) {
    const messages = [];
    // Setup the build options for the application based on the buildTarget option
    const buildOptions = (await context.validateOptions(await context.getTargetOptions(options.buildTarget), builderName));
    buildOptions.optimization = false;
    buildOptions.sourceMap = { scripts: true, vendor: true, styles: false };
    buildOptions.localize = false;
    buildOptions.budgets = undefined;
    buildOptions.index = false;
    buildOptions.serviceWorker = false;
    buildOptions.outputMode = schema_1.OutputMode.Static;
    buildOptions.appShell = undefined;
    buildOptions.ssr = undefined;
    buildOptions.prerender = undefined;
    buildOptions.server = undefined;
    // Build the application with the build options
    const builderResult = await first((0, application_1.buildApplicationInternal)(buildOptions, context, extensions));
    let success = false;
    if (!builderResult || builderResult.kind === results_1.ResultKind.Failure) {
        context.logger.error('Application build failed.');
    }
    else if (builderResult.kind !== results_1.ResultKind.Full) {
        context.logger.error('Application build did not provide a full output.');
    }
    else {
        // Setup the localize message extractor based on the in-memory files
        const extractor = setupLocalizeExtractor(extractorConstructor, builderResult.files, context);
        // Extract messages from each output JavaScript file.
        // Output files are only present on a successful build.
        for (const filePath of Object.keys(builderResult.files)) {
            if (!filePath.endsWith('.js')) {
                continue;
            }
            const fileMessages = extractor.extractMessages(filePath);
            messages.push(...fileMessages);
        }
        success = true;
    }
    return {
        success,
        basePath: context.workspaceRoot,
        messages,
        // Legacy i18n identifiers are not supported with the new application builder
        useLegacyIds: false,
    };
}
function setupLocalizeExtractor(extractorConstructor, files, context) {
    const textDecoder = new TextDecoder();
    // Setup a virtual file system instance for the extractor
    // * MessageExtractor itself uses readFile, relative and resolve
    // * Internal SourceFileLoader (sourcemap support) uses dirname, exists, readFile, and resolve
    const filesystem = {
        readFile(path) {
            // Output files are stored as relative to the workspace root
            const requestedPath = node_path_1.default.relative(context.workspaceRoot, path);
            const file = files[requestedPath];
            let content;
            if (file?.origin === 'memory') {
                content = textDecoder.decode(file.contents);
            }
            else if (file?.origin === 'disk') {
                content = (0, node_fs_1.readFileSync)(file.inputPath, 'utf-8');
            }
            if (content === undefined) {
                throw new Error('Unknown file requested: ' + requestedPath);
            }
            return content;
        },
        relative(from, to) {
            return node_path_1.default.relative(from, to);
        },
        resolve(...paths) {
            return node_path_1.default.resolve(...paths);
        },
        exists(path) {
            // Output files are stored as relative to the workspace root
            const requestedPath = node_path_1.default.relative(context.workspaceRoot, path);
            return files[requestedPath] !== undefined;
        },
        dirname(path) {
            return node_path_1.default.dirname(path);
        },
    };
    const logger = {
        // level 2 is warnings
        level: 2,
        debug(...args) {
            // eslint-disable-next-line no-console
            console.debug(...args);
        },
        info(...args) {
            context.logger.info(args.join(''));
        },
        warn(...args) {
            context.logger.warn(args.join(''));
        },
        error(...args) {
            context.logger.error(args.join(''));
        },
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const extractor = new extractorConstructor(filesystem, logger, {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        basePath: context.workspaceRoot,
        useSourceMaps: true,
    });
    return extractor;
}
async function first(iterable) {
    for await (const value of iterable) {
        return value;
    }
}
