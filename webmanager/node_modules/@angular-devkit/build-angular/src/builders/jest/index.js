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
Object.defineProperty(exports, "__esModule", { value: true });
const private_1 = require("@angular/build/private");
const architect_1 = require("@angular-devkit/architect");
const node_child_process_1 = require("node:child_process");
const node_crypto_1 = require("node:crypto");
const fs = __importStar(require("node:fs/promises"));
const path = __importStar(require("node:path"));
const node_util_1 = require("node:util");
const color_1 = require("../../utils/color");
const test_files_1 = require("../../utils/test-files");
const schema_1 = require("../browser-esbuild/schema");
const write_test_files_1 = require("../web-test-runner/write-test-files");
const options_1 = require("./options");
const execFile = (0, node_util_1.promisify)(node_child_process_1.execFile);
/** Main execution function for the Jest builder. */
exports.default = (0, architect_1.createBuilder)(async (schema, context) => {
    context.logger.warn('NOTE: The Jest builder is currently EXPERIMENTAL and not ready for production use.');
    const options = (0, options_1.normalizeOptions)(schema);
    const testOut = path.join(context.workspaceRoot, 'dist/test-out', (0, node_crypto_1.randomUUID)()); // TODO(dgp1130): Hide in temp directory.
    // Verify Jest installation and get the path to it's binary.
    // We need to `node_modules/.bin/jest`, but there is no means to resolve that directly. Fortunately Jest's `package.json` exports the
    // same file at `bin/jest`, so we can just resolve that instead.
    const jest = resolveModule('jest/bin/jest');
    if (!jest) {
        return {
            success: false,
            // TODO(dgp1130): Display a more accurate message for non-NPM users.
            error: 'Jest is not installed, most likely you need to run `npm install jest --save-dev` in your project.',
        };
    }
    // Verify that JSDom is installed in the project.
    const environment = resolveModule('jest-environment-jsdom');
    if (!environment) {
        return {
            success: false,
            // TODO(dgp1130): Display a more accurate message for non-NPM users.
            error: '`jest-environment-jsdom` is not installed. Install it with `npm install jest-environment-jsdom --save-dev`.',
        };
    }
    const [testFiles, customConfig] = await Promise.all([
        (0, test_files_1.findTestFiles)(options.include, options.exclude, context.workspaceRoot),
        findCustomJestConfig(context.workspaceRoot),
    ]);
    // Warn if a custom Jest configuration is found. We won't use it, so if a developer is trying to use a custom config, this hopefully
    // makes a better experience than silently ignoring the configuration.
    // Ideally, this would be a hard error. However a Jest config could exist for testing other files in the workspace outside of Angular
    // CLI, so we likely can't produce a hard error in this situation without an opt-out.
    if (customConfig) {
        context.logger.warn('A custom Jest config was found, but this is not supported by `@angular-devkit/build-angular:jest` and will be' +
            ` ignored: ${customConfig}. This is an experiment to see if completely abstracting away Jest's configuration is viable. Please` +
            ` consider if your use case can be met without directly modifying the Jest config. If this is a major obstacle for your use` +
            ` case, please post it in this issue so we can collect feedback and evaluate: https://github.com/angular/angular-cli/issues/25434.`);
    }
    // Build all the test files.
    const jestGlobal = path.join(__dirname, 'jest-global.mjs');
    const initTestBed = path.join(__dirname, 'init-test-bed.mjs');
    const buildResult = await first((0, private_1.buildApplicationInternal)({
        // Build all the test files and also the `jest-global` and `init-test-bed` scripts.
        entryPoints: new Set([...testFiles, jestGlobal, initTestBed]),
        tsConfig: options.tsConfig,
        polyfills: options.polyfills ?? ['zone.js', 'zone.js/testing'],
        outputPath: testOut,
        aot: options.aot,
        index: false,
        outputHashing: schema_1.OutputHashing.None,
        outExtension: 'mjs', // Force native ESM.
        optimization: false,
        sourceMap: {
            scripts: true,
            styles: false,
            vendor: false,
        },
    }, context));
    if (buildResult.kind === private_1.ResultKind.Failure) {
        return { success: false };
    }
    else if (buildResult.kind !== private_1.ResultKind.Full) {
        return {
            success: false,
            error: 'A full build result is required from the application builder.',
        };
    }
    // Write test files
    await (0, write_test_files_1.writeTestFiles)(buildResult.files, testOut);
    // Execute Jest on the built output directory.
    const jestProc = execFile(process.execPath, [
        '--experimental-vm-modules',
        jest,
        `--rootDir="${testOut}"`,
        `--config=${path.join(__dirname, 'jest.config.mjs')}`,
        '--testEnvironment=jsdom',
        // TODO(dgp1130): Enable cache once we have a mechanism for properly clearing / disabling it.
        '--no-cache',
        // Run basically all files in the output directory, any excluded files were already dropped by the build.
        `--testMatch="<rootDir>/**/*.mjs"`,
        // Load polyfills and initialize the environment before executing each test file.
        // IMPORTANT: Order matters here.
        // First, we execute `jest-global.mjs` to initialize the `jest` global variable.
        // Second, we execute user polyfills, including `zone.js` and `zone.js/testing`. This is dependent on the Jest global so it can patch
        // the environment for fake async to work correctly.
        // Third, we initialize `TestBed`. This is dependent on fake async being set up correctly beforehand.
        `--setupFilesAfterEnv="<rootDir>/jest-global.mjs"`,
        ...(options.polyfills ? [`--setupFilesAfterEnv="<rootDir>/polyfills.mjs"`] : []),
        `--setupFilesAfterEnv="<rootDir>/init-test-bed.mjs"`,
        // Don't run any infrastructure files as tests, they are manually loaded where needed.
        `--testPathIgnorePatterns="<rootDir>/jest-global\\.mjs"`,
        ...(options.polyfills ? [`--testPathIgnorePatterns="<rootDir>/polyfills\\.mjs"`] : []),
        `--testPathIgnorePatterns="<rootDir>/init-test-bed\\.mjs"`,
        // Skip shared chunks, as they are not entry points to tests.
        `--testPathIgnorePatterns="<rootDir>/chunk-.*\\.mjs"`,
        // Optionally enable color.
        ...(color_1.colors.enabled ? ['--colors'] : []),
    ]);
    // Stream test output to the terminal.
    jestProc.child.stdout?.on('data', (chunk) => {
        context.logger.info(chunk);
    });
    jestProc.child.stderr?.on('data', (chunk) => {
        // Write to stderr directly instead of `context.logger.error(chunk)` because the logger will overwrite Jest's coloring information.
        process.stderr.write(chunk);
    });
    try {
        await jestProc;
    }
    catch (error) {
        // No need to propagate error message, already piped to terminal output.
        // TODO(dgp1130): Handle process spawning failures.
        return { success: false };
    }
    return { success: true };
});
/** Returns the first item yielded by the given generator and cancels the execution. */
async function first(generator) {
    for await (const value of generator) {
        return value;
    }
    throw new Error('Expected generator to emit at least once.');
}
/** Safely resolves the given Node module string. */
function resolveModule(module) {
    try {
        return require.resolve(module);
    }
    catch {
        return undefined;
    }
}
/** Returns whether or not the provided directory includes a Jest configuration file. */
async function findCustomJestConfig(dir) {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    // Jest supports many file extensions (`js`, `ts`, `cjs`, `cts`, `json`, etc.) Just look
    // for anything with that prefix.
    const config = entries.find((entry) => entry.isFile() && entry.name.startsWith('jest.config.'));
    if (config) {
        return path.join(dir, config.name);
    }
    // Jest also supports a `jest` key in `package.json`, look for a config there.
    const packageJsonPath = path.join(dir, 'package.json');
    let packageJson;
    try {
        packageJson = await fs.readFile(packageJsonPath, 'utf8');
    }
    catch {
        return undefined; // No package.json, therefore no Jest configuration in it.
    }
    const json = JSON.parse(packageJson);
    if ('jest' in json) {
        return packageJsonPath;
    }
    return undefined;
}
