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
exports.writeTestFiles = writeTestFiles;
const node_crypto_1 = require("node:crypto");
const node_fs_1 = require("node:fs");
const fs = __importStar(require("node:fs/promises"));
const node_module_1 = require("node:module");
const node_path_1 = __importDefault(require("node:path"));
const tinyglobby_1 = require("tinyglobby");
const bundler_context_1 = require("../../tools/esbuild/bundler-context");
const utils_1 = require("../../tools/esbuild/utils");
const virtual_module_plugin_1 = require("../../tools/esbuild/virtual-module-plugin");
const project_metadata_1 = require("../../utils/project-metadata");
const index_1 = require("../application/index");
const results_1 = require("../application/results");
const schema_1 = require("../application/schema");
const find_tests_1 = require("./find-tests");
const options_1 = require("./options");
const localResolve = (0, node_module_1.createRequire)(__filename).resolve;
const isWindows = process.platform === 'win32';
class ApplicationBuildError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ApplicationBuildError';
    }
}
const LATEST_BUILD_FILES_TOKEN = 'angularLatestBuildFiles';
class AngularAssetsMiddleware {
    serveFile;
    latestBuildFiles;
    static $inject = ['serveFile', LATEST_BUILD_FILES_TOKEN];
    static NAME = 'angular-test-assets';
    constructor(serveFile, latestBuildFiles) {
        this.serveFile = serveFile;
        this.latestBuildFiles = latestBuildFiles;
    }
    handle(req, res, next) {
        const url = new URL(`http://${req.headers['host']}${req.url}`);
        // Remove the leading slash from the URL path and convert to platform specific.
        // The latest build files will use the platform path separator.
        let pathname = url.pathname.slice(1);
        if (isWindows) {
            pathname = pathname.replaceAll(node_path_1.default.posix.sep, node_path_1.default.win32.sep);
        }
        const file = this.latestBuildFiles.files[pathname];
        if (!file) {
            next();
            return;
        }
        // Implementation of serverFile can be found here:
        // https://github.com/karma-runner/karma/blob/84f85e7016efc2266fa6b3465f494a3fa151c85c/lib/middleware/common.js#L10
        switch (file.origin) {
            case 'disk':
                this.serveFile(file.inputPath, undefined, res, undefined, undefined, /* doNotCache */ true);
                break;
            case 'memory':
                // Include pathname to help with Content-Type headers.
                this.serveFile(`/unused/${url.pathname}`, undefined, res, undefined, file.contents, 
                /* doNotCache */ false);
                break;
        }
    }
    static createPlugin(initialFiles) {
        return {
            [LATEST_BUILD_FILES_TOKEN]: ['value', { files: { ...initialFiles.files } }],
            [`middleware:${AngularAssetsMiddleware.NAME}`]: [
                'factory',
                Object.assign((...args) => {
                    const inst = new AngularAssetsMiddleware(...args);
                    return inst.handle.bind(inst);
                }, AngularAssetsMiddleware),
            ],
        };
    }
}
class AngularPolyfillsPlugin {
    static $inject = ['config.files'];
    static NAME = 'angular-polyfills';
    static createPlugin(polyfillsFile, jasmineCleanupFiles, scriptsFiles) {
        return {
            // This has to be a "reporter" because reporters run _after_ frameworks
            // and karma-jasmine-html-reporter injects additional scripts that may
            // depend on Jasmine but aren't modules - which means that they would run
            // _before_ all module code (including jasmine).
            [`reporter:${AngularPolyfillsPlugin.NAME}`]: [
                'factory',
                Object.assign((files) => {
                    // The correct order is zone.js -> jasmine -> zone.js/testing.
                    // Jasmine has to see the patched version of the global `setTimeout`
                    // function so it doesn't cache the unpatched version. And /testing
                    // needs to see the global `jasmine` object so it can patch it.
                    const polyfillsIndex = 0;
                    files.splice(polyfillsIndex, 0, polyfillsFile);
                    // Insert just before test_main.js.
                    const zoneTestingIndex = files.findIndex((f) => {
                        if (typeof f === 'string') {
                            return false;
                        }
                        return f.pattern.endsWith('/test_main.js');
                    });
                    if (zoneTestingIndex === -1) {
                        throw new Error('Could not find test entrypoint file.');
                    }
                    files.splice(zoneTestingIndex, 0, jasmineCleanupFiles);
                    // We need to ensure that all files are served as modules, otherwise
                    // the order in the files list gets really confusing: Karma doesn't
                    // set defer on scripts, so all scripts with type=js will run first,
                    // even if type=module files appeared earlier in `files`.
                    for (const f of files) {
                        if (typeof f === 'string') {
                            throw new Error(`Unexpected string-based file: "${f}"`);
                        }
                        if (f.included === false) {
                            // Don't worry about files that aren't included on the initial
                            // page load. `type` won't affect them.
                            continue;
                        }
                        if (f.pattern.endsWith('.js') && 'js' === (f.type ?? 'js')) {
                            f.type = 'module';
                        }
                    }
                    // Add "scripts" option files as classic scripts
                    files.unshift(...scriptsFiles);
                    // Add browser sourcemap support as a classic script
                    files.unshift({
                        pattern: localResolve('source-map-support/browser-source-map-support.js'),
                        included: true,
                        watched: false,
                    });
                    // Karma needs a return value for a factory and Karma's multi-reporter expects an `adapters` array
                    return { adapters: [] };
                }, AngularPolyfillsPlugin),
            ],
        };
    }
}
function injectKarmaReporter(buildOptions, buildIterator, karmaConfig, controller) {
    const reporterName = 'angular-progress-notifier';
    class ProgressNotifierReporter {
        emitter;
        latestBuildFiles;
        static $inject = ['emitter', LATEST_BUILD_FILES_TOKEN];
        constructor(emitter, latestBuildFiles) {
            this.emitter = emitter;
            this.latestBuildFiles = latestBuildFiles;
            this.startWatchingBuild();
        }
        startWatchingBuild() {
            void (async () => {
                // This is effectively "for await of but skip what's already consumed".
                let isDone = false; // to mark the loop condition as "not constant".
                while (!isDone) {
                    const { done, value: buildOutput } = await buildIterator.next();
                    if (done) {
                        isDone = true;
                        break;
                    }
                    if (buildOutput.kind === results_1.ResultKind.Failure) {
                        controller.enqueue({ success: false, message: 'Build failed' });
                    }
                    else if (buildOutput.kind === results_1.ResultKind.Incremental ||
                        buildOutput.kind === results_1.ResultKind.Full) {
                        if (buildOutput.kind === results_1.ResultKind.Full) {
                            this.latestBuildFiles.files = buildOutput.files;
                        }
                        else {
                            this.latestBuildFiles.files = {
                                ...this.latestBuildFiles.files,
                                ...buildOutput.files,
                            };
                        }
                        await writeTestFiles(buildOutput.files, buildOptions.outputPath);
                        this.emitter.refreshFiles();
                    }
                }
            })();
        }
        onRunComplete = function (_browsers, results) {
            if (results.exitCode === 0) {
                controller.enqueue({ success: true });
            }
            else {
                controller.enqueue({ success: false });
            }
        };
    }
    karmaConfig.reporters ??= [];
    karmaConfig.reporters.push(reporterName);
    karmaConfig.plugins ??= [];
    karmaConfig.plugins.push({
        [`reporter:${reporterName}`]: [
            'factory',
            Object.assign((...args) => new ProgressNotifierReporter(...args), ProgressNotifierReporter),
        ],
    });
}
function execute(options, context, transforms) {
    const normalizedOptions = (0, options_1.normalizeOptions)(context, options);
    const karmaOptions = getBaseKarmaOptions(normalizedOptions, context);
    let karmaServer;
    return new ReadableStream({
        async start(controller) {
            let init;
            try {
                init = await initializeApplication(normalizedOptions, context, karmaOptions, transforms);
            }
            catch (err) {
                if (err instanceof ApplicationBuildError) {
                    controller.enqueue({ success: false, message: err.message });
                    controller.close();
                    return;
                }
                throw err;
            }
            const [karma, karmaConfig, buildOptions, buildIterator] = init;
            // If `--watch` is explicitly enabled or if we are keeping the Karma
            // process running, we should hook Karma into the build.
            if (buildIterator) {
                injectKarmaReporter(buildOptions, buildIterator, karmaConfig, controller);
            }
            // Close the stream once the Karma server returns.
            karmaServer = new karma.Server(karmaConfig, (exitCode) => {
                controller.enqueue({ success: exitCode === 0 });
                controller.close();
            });
            await karmaServer.start();
        },
        async cancel() {
            await karmaServer?.stop();
        },
    });
}
async function getProjectSourceRoot(context) {
    // We have already validated that the project name is set before calling this function.
    const projectName = context.target?.project;
    if (!projectName) {
        return context.workspaceRoot;
    }
    const projectMetadata = await context.getProjectMetadata(projectName);
    const { projectSourceRoot } = (0, project_metadata_1.getProjectRootPaths)(context.workspaceRoot, projectMetadata);
    return projectSourceRoot;
}
function normalizePolyfills(polyfills = []) {
    const jasmineGlobalEntryPoint = localResolve('./polyfills/jasmine_global.js');
    const jasmineGlobalCleanupEntrypoint = localResolve('./polyfills/jasmine_global_cleanup.js');
    const sourcemapEntrypoint = localResolve('./polyfills/init_sourcemaps.js');
    const zoneTestingEntryPoint = 'zone.js/testing';
    const polyfillsExludingZoneTesting = polyfills.filter((p) => p !== zoneTestingEntryPoint);
    return [
        polyfillsExludingZoneTesting.concat([jasmineGlobalEntryPoint, sourcemapEntrypoint]),
        polyfillsExludingZoneTesting.length === polyfills.length
            ? [jasmineGlobalCleanupEntrypoint]
            : [jasmineGlobalCleanupEntrypoint, zoneTestingEntryPoint],
    ];
}
async function collectEntrypoints(options, context, projectSourceRoot) {
    // Glob for files to test.
    const testFiles = await (0, find_tests_1.findTests)(options.include, options.exclude, context.workspaceRoot, projectSourceRoot);
    return (0, find_tests_1.getTestEntrypoints)(testFiles, { projectSourceRoot, workspaceRoot: context.workspaceRoot });
}
// eslint-disable-next-line max-lines-per-function
async function initializeApplication(options, context, karmaOptions, transforms) {
    const outputPath = node_path_1.default.join(context.workspaceRoot, 'dist/test-out', (0, node_crypto_1.randomUUID)());
    const projectSourceRoot = await getProjectSourceRoot(context);
    // Setup exit cleanup for temporary directory
    const handleProcessExit = () => (0, node_fs_1.rmSync)(outputPath, { recursive: true, force: true });
    process.once('exit', handleProcessExit);
    process.once('SIGINT', handleProcessExit);
    process.once('uncaughtException', handleProcessExit);
    const [karma, entryPoints] = await Promise.all([
        Promise.resolve().then(() => __importStar(require('karma'))),
        collectEntrypoints(options, context, projectSourceRoot),
        fs.rm(outputPath, { recursive: true, force: true }),
    ]);
    const mainName = 'test_main';
    if (options.main) {
        entryPoints.set(mainName, options.main);
    }
    else {
        entryPoints.set(mainName, 'angular:test-bed-init');
    }
    const instrumentForCoverage = options.codeCoverage
        ? createInstrumentationFilter(projectSourceRoot, getInstrumentationExcludedPaths(context.workspaceRoot, options.codeCoverageExclude ?? []))
        : undefined;
    const [polyfills, jasmineCleanup] = normalizePolyfills(options.polyfills);
    for (let idx = 0; idx < jasmineCleanup.length; ++idx) {
        entryPoints.set(`jasmine-cleanup-${idx}`, jasmineCleanup[idx]);
    }
    const buildOptions = {
        assets: options.assets,
        entryPoints,
        tsConfig: options.tsConfig,
        outputPath,
        preserveSymlinks: options.preserveSymlinks,
        aot: options.aot,
        index: false,
        outputHashing: schema_1.OutputHashing.None,
        optimization: false,
        sourceMap: options.sourceMap,
        instrumentForCoverage,
        styles: options.styles,
        scripts: options.scripts,
        polyfills,
        webWorkerTsConfig: options.webWorkerTsConfig,
        watch: options.watch,
        stylePreprocessorOptions: options.stylePreprocessorOptions,
        inlineStyleLanguage: options.inlineStyleLanguage,
        fileReplacements: options.fileReplacements,
        define: options.define,
        loader: options.loader,
        externalDependencies: options.externalDependencies,
    };
    const virtualTestBedInit = (0, virtual_module_plugin_1.createVirtualModulePlugin)({
        namespace: 'angular:test-bed-init',
        loadContent: async () => {
            const contents = [
                // Initialize the Angular testing environment
                `import { getTestBed } from '@angular/core/testing';`,
                `import { BrowserTestingModule, platformBrowserTesting } from '@angular/platform-browser/testing';`,
                `getTestBed().initTestEnvironment(BrowserTestingModule, platformBrowserTesting(), {`,
                `  errorOnUnknownElements: true,`,
                `  errorOnUnknownProperties: true,`,
                '});',
            ];
            return {
                contents: contents.join('\n'),
                loader: 'js',
                resolveDir: projectSourceRoot,
            };
        },
    });
    // Build tests with `application` builder, using test files as entry points.
    const [buildOutput, buildIterator] = await first((0, index_1.buildApplicationInternal)(buildOptions, context, { codePlugins: [virtualTestBedInit] }), { cancel: !buildOptions.watch });
    if (buildOutput.kind === results_1.ResultKind.Failure) {
        throw new ApplicationBuildError('Build failed');
    }
    else if (buildOutput.kind !== results_1.ResultKind.Full) {
        throw new ApplicationBuildError('A full build result is required from the application builder.');
    }
    // Write test files
    await writeTestFiles(buildOutput.files, buildOptions.outputPath);
    // We need to add this to the beginning *after* the testing framework has
    // prepended its files. The output path is required for each since they are
    // added later in the test process via a plugin.
    const polyfillsFile = {
        pattern: `${outputPath}/polyfills.js`,
        included: true,
        served: true,
        type: 'module',
        watched: false,
    };
    const jasmineCleanupFiles = {
        pattern: `${outputPath}/jasmine-cleanup-*.js`,
        included: true,
        served: true,
        type: 'module',
        watched: false,
    };
    karmaOptions.basePath = outputPath;
    const scriptsFiles = [];
    if (options.scripts?.length) {
        const outputScripts = new Set();
        for (const scriptEntry of options.scripts) {
            const outputName = typeof scriptEntry === 'string'
                ? 'scripts.js'
                : `${scriptEntry.bundleName ?? 'scripts'}.js`;
            if (outputScripts.has(outputName)) {
                continue;
            }
            outputScripts.add(outputName);
            scriptsFiles.push({
                pattern: `${outputPath}/${outputName}`,
                watched: false,
                included: typeof scriptEntry === 'string' ? true : scriptEntry.inject !== false,
                type: 'js',
            });
        }
    }
    karmaOptions.files ??= [];
    karmaOptions.files.push(
    // Serve global setup script.
    { pattern: `${mainName}.js`, type: 'module', watched: false }, 
    // Serve all source maps.
    { pattern: `*.map`, included: false, watched: false }, 
    // These are the test entrypoints.
    { pattern: `spec-*.js`, type: 'module', watched: false });
    if (hasChunkOrWorkerFiles(buildOutput.files)) {
        karmaOptions.files.push(
        // Allow loading of chunk-* files but don't include them all on load.
        {
            pattern: `{chunk,worker}-*.js`,
            type: 'module',
            included: false,
            watched: false,
        });
    }
    if (options.styles?.length) {
        // Serve CSS outputs on page load, these are the global styles.
        karmaOptions.files.push({ pattern: `*.css`, type: 'css', watched: false });
    }
    const parsedKarmaConfig = await karma.config.parseConfig(options.karmaConfig, transforms?.karmaOptions ? await transforms.karmaOptions(karmaOptions) : karmaOptions, { promiseConfig: true, throwErrors: true });
    // Check for jsdom which does not support executing ESM scripts.
    // If present, remove jsdom and issue a warning.
    const updatedBrowsers = parsedKarmaConfig.browsers?.filter((browser) => browser !== 'jsdom');
    if (parsedKarmaConfig.browsers?.length !== updatedBrowsers?.length) {
        parsedKarmaConfig.browsers = updatedBrowsers;
        context.logger.warn(`'jsdom' does not support ESM code execution and cannot be used for karma testing.` +
            ` The 'jsdom' entry has been removed from the 'browsers' option.`);
    }
    // Remove the webpack plugin/framework:
    // Alternative would be to make the Karma plugin "smart" but that's a tall order
    // with managing unneeded imports etc..
    parsedKarmaConfig.plugins ??= [];
    const pluginLengthBefore = parsedKarmaConfig.plugins.length;
    parsedKarmaConfig.plugins = parsedKarmaConfig.plugins.filter((plugin) => {
        if (typeof plugin === 'string') {
            return plugin !== 'framework:@angular-devkit/build-angular';
        }
        return !plugin['framework:@angular-devkit/build-angular'];
    });
    parsedKarmaConfig.frameworks ??= [];
    parsedKarmaConfig.frameworks = parsedKarmaConfig.frameworks.filter((framework) => framework !== '@angular-devkit/build-angular');
    const pluginLengthAfter = parsedKarmaConfig.plugins.length;
    if (pluginLengthBefore !== pluginLengthAfter) {
        context.logger.warn(`Ignoring framework "@angular-devkit/build-angular" from karma config file because it's not compatible with the application builder.`);
    }
    parsedKarmaConfig.plugins.push(AngularAssetsMiddleware.createPlugin(buildOutput));
    parsedKarmaConfig.middleware ??= [];
    parsedKarmaConfig.middleware.push(AngularAssetsMiddleware.NAME);
    parsedKarmaConfig.plugins.push(AngularPolyfillsPlugin.createPlugin(polyfillsFile, jasmineCleanupFiles, scriptsFiles));
    parsedKarmaConfig.reporters ??= [];
    parsedKarmaConfig.reporters.push(AngularPolyfillsPlugin.NAME);
    // Adjust karma junit reporter outDir location to maintain previous (devkit) behavior
    // The base path for the reporter was previously the workspace root.
    // To keep the files in the same location, the reporter's output directory is adjusted
    // to be relative to the workspace root when using junit.
    if (parsedKarmaConfig.reporters?.some((reporter) => reporter === 'junit')) {
        if ('junitReporter' in parsedKarmaConfig) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const junitReporterOptions = parsedKarmaConfig['junitReporter'];
            if (junitReporterOptions.outputDir == undefined) {
                junitReporterOptions.outputDir = context.workspaceRoot;
            }
            else if (typeof junitReporterOptions.outputDir === 'string' &&
                !node_path_1.default.isAbsolute(junitReporterOptions.outputDir)) {
                junitReporterOptions.outputDir = node_path_1.default.join(context.workspaceRoot, junitReporterOptions.outputDir);
            }
        }
        else {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            parsedKarmaConfig['junitReporter'] = {
                outputDir: context.workspaceRoot,
            };
        }
    }
    // When using code-coverage, auto-add karma-coverage.
    // This was done as part of the karma plugin for webpack.
    if (options.codeCoverage &&
        !parsedKarmaConfig.reporters?.some((r) => r === 'coverage' || r === 'coverage-istanbul')) {
        parsedKarmaConfig.reporters = (parsedKarmaConfig.reporters ?? []).concat(['coverage']);
    }
    return [karma, parsedKarmaConfig, buildOptions, buildIterator];
}
function hasChunkOrWorkerFiles(files) {
    return Object.keys(files).some((filename) => {
        return /(?:^|\/)(?:worker|chunk)[^/]+\.js$/.test(filename);
    });
}
async function writeTestFiles(files, testDir) {
    const directoryExists = new Set();
    // Writes the test related output files to disk and ensures the containing directories are present
    await (0, utils_1.emitFilesToDisk)(Object.entries(files), async ([filePath, file]) => {
        if (file.type !== bundler_context_1.BuildOutputFileType.Browser && file.type !== bundler_context_1.BuildOutputFileType.Media) {
            return;
        }
        const fullFilePath = node_path_1.default.join(testDir, filePath);
        // Ensure output subdirectories exist
        const fileBasePath = node_path_1.default.dirname(fullFilePath);
        if (fileBasePath && !directoryExists.has(fileBasePath)) {
            await fs.mkdir(fileBasePath, { recursive: true });
            directoryExists.add(fileBasePath);
        }
        if (file.origin === 'memory') {
            // Write file contents
            await fs.writeFile(fullFilePath, file.contents);
        }
        else {
            // Copy file contents
            await fs.copyFile(file.inputPath, fullFilePath, fs.constants.COPYFILE_FICLONE);
        }
    });
}
/** Returns the first item yielded by the given generator and cancels the execution. */
async function first(generator, { cancel }) {
    if (!cancel) {
        const iterator = generator[Symbol.asyncIterator]();
        const firstValue = await iterator.next();
        if (firstValue.done) {
            throw new Error('Expected generator to emit at least once.');
        }
        return [firstValue.value, iterator];
    }
    for await (const value of generator) {
        return [value, null];
    }
    throw new Error('Expected generator to emit at least once.');
}
function createInstrumentationFilter(includedBasePath, excludedPaths) {
    return (request) => {
        return (!excludedPaths.has(request) &&
            !/\.(e2e|spec)\.tsx?$|[\\/]node_modules[\\/]/.test(request) &&
            request.startsWith(includedBasePath));
    };
}
function getInstrumentationExcludedPaths(root, excludedPaths) {
    const excluded = new Set();
    for (const excludeGlob of excludedPaths) {
        const excludePath = excludeGlob[0] === '/' ? excludeGlob.slice(1) : excludeGlob;
        (0, tinyglobby_1.globSync)(excludePath, { cwd: root }).forEach((p) => excluded.add(node_path_1.default.join(root, p)));
    }
    return excluded;
}
function getBaseKarmaOptions(options, context) {
    // Determine project name from builder context target
    const projectName = context.target?.project;
    if (!projectName) {
        throw new Error(`The 'karma' builder requires a target to be specified.`);
    }
    const karmaOptions = options.karmaConfig
        ? {}
        : getBuiltInKarmaConfig(context.workspaceRoot, projectName);
    const singleRun = !options.watch;
    karmaOptions.singleRun = singleRun;
    // Workaround https://github.com/angular/angular-cli/issues/28271, by clearing context by default
    // for single run executions. Not clearing context for multi-run (watched) builds allows the
    // Jasmine Spec Runner to be visible in the browser after test execution.
    karmaOptions.client ??= {};
    karmaOptions.client.clearContext ??= singleRun;
    // Convert browsers from a string to an array
    if (options.browsers) {
        karmaOptions.browsers = options.browsers;
    }
    if (options.reporters) {
        karmaOptions.reporters = options.reporters;
    }
    return karmaOptions;
}
function getBuiltInKarmaConfig(workspaceRoot, projectName) {
    let coverageFolderName = projectName.charAt(0) === '@' ? projectName.slice(1) : projectName;
    coverageFolderName = coverageFolderName.toLowerCase();
    const workspaceRootRequire = (0, node_module_1.createRequire)(workspaceRoot + '/');
    // Any changes to the config here need to be synced to: packages/schematics/angular/config/files/karma.conf.js.template
    return {
        basePath: '',
        frameworks: ['jasmine'],
        plugins: [
            'karma-jasmine',
            'karma-chrome-launcher',
            'karma-jasmine-html-reporter',
            'karma-coverage',
        ].map((p) => workspaceRootRequire(p)),
        jasmineHtmlReporter: {
            suppressAll: true, // removes the duplicated traces
        },
        coverageReporter: {
            dir: node_path_1.default.join(workspaceRoot, 'coverage', coverageFolderName),
            subdir: '.',
            reporters: [{ type: 'html' }, { type: 'text-summary' }],
        },
        reporters: ['progress', 'kjhtml'],
        browsers: ['Chrome'],
        customLaunchers: {
            // Chrome configured to run in a bazel sandbox.
            // Disable the use of the gpu and `/dev/shm` because it causes Chrome to
            // crash on some environments.
            // See:
            //   https://github.com/puppeteer/puppeteer/blob/v1.0.0/docs/troubleshooting.md#tips
            //   https://stackoverflow.com/questions/50642308/webdriverexception-unknown-error-devtoolsactiveport-file-doesnt-exist-while-t
            ChromeHeadlessNoSandbox: {
                base: 'ChromeHeadless',
                flags: ['--no-sandbox', '--headless', '--disable-gpu', '--disable-dev-shm-usage'],
            },
        },
        restartOnFileChange: true,
    };
}
