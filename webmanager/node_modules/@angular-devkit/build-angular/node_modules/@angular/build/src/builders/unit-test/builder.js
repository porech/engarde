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
exports.execute = execute;
const node_assert_1 = __importDefault(require("node:assert"));
const node_crypto_1 = require("node:crypto");
const node_module_1 = require("node:module");
const node_path_1 = __importDefault(require("node:path"));
const virtual_module_plugin_1 = require("../../tools/esbuild/virtual-module-plugin");
const error_1 = require("../../utils/error");
const load_esm_1 = require("../../utils/load-esm");
const path_1 = require("../../utils/path");
const application_1 = require("../application");
const results_1 = require("../application/results");
const schema_1 = require("../application/schema");
const application_builder_1 = require("../karma/application_builder");
const find_tests_1 = require("../karma/find-tests");
const karma_bridge_1 = require("./karma-bridge");
const options_1 = require("./options");
function adjustOutputHashing(hashing) {
    switch (hashing) {
        case schema_1.OutputHashing.All:
        case schema_1.OutputHashing.Media:
            // Ensure media is continued to be hashed to avoid overwriting of output media files
            return schema_1.OutputHashing.Media;
        default:
            return schema_1.OutputHashing.None;
    }
}
/**
 * @experimental Direct usage of this function is considered experimental.
 */
// eslint-disable-next-line max-lines-per-function
async function* execute(options, context, extensions = {}) {
    // Determine project name from builder context target
    const projectName = context.target?.project;
    if (!projectName) {
        context.logger.error(`The "${context.builder.builderName}" builder requires a target to be specified.`);
        return;
    }
    context.logger.warn(`NOTE: The "${context.builder.builderName}" builder is currently EXPERIMENTAL and not ready for production use.`);
    const normalizedOptions = await (0, options_1.normalizeOptions)(context, projectName, options);
    const { projectSourceRoot, workspaceRoot, runnerName } = normalizedOptions;
    // Translate options and use karma builder directly if specified
    if (runnerName === 'karma') {
        const karmaBridge = await (0, karma_bridge_1.useKarmaBuilder)(context, normalizedOptions);
        yield* karmaBridge;
        return;
    }
    if (runnerName !== 'vitest') {
        context.logger.error('Unknown test runner: ' + runnerName);
        return;
    }
    // Find test files
    const testFiles = await (0, find_tests_1.findTests)(normalizedOptions.include, normalizedOptions.exclude, workspaceRoot, projectSourceRoot);
    if (testFiles.length === 0) {
        context.logger.error('No tests found.');
        return { success: false };
    }
    const entryPoints = (0, find_tests_1.getTestEntrypoints)(testFiles, { projectSourceRoot, workspaceRoot });
    entryPoints.set('init-testbed', 'angular:test-bed-init');
    let vitestNodeModule;
    try {
        vitestNodeModule = await (0, load_esm_1.loadEsmModule)('vitest/node');
    }
    catch (error) {
        (0, error_1.assertIsError)(error);
        if (error.code !== 'ERR_MODULE_NOT_FOUND') {
            throw error;
        }
        context.logger.error('The `vitest` package was not found. Please install the package and rerun the test command.');
        return;
    }
    const { startVitest } = vitestNodeModule;
    // Setup test file build options based on application build target options
    const buildTargetOptions = (await context.validateOptions(await context.getTargetOptions(normalizedOptions.buildTarget), await context.getBuilderNameForTarget(normalizedOptions.buildTarget)));
    buildTargetOptions.polyfills = (0, options_1.injectTestingPolyfills)(buildTargetOptions.polyfills);
    const outputPath = (0, path_1.toPosixPath)(node_path_1.default.join(context.workspaceRoot, generateOutputPath()));
    const buildOptions = {
        ...buildTargetOptions,
        watch: normalizedOptions.watch,
        incrementalResults: normalizedOptions.watch,
        outputPath,
        index: false,
        browser: undefined,
        server: undefined,
        outputMode: undefined,
        localize: false,
        budgets: [],
        serviceWorker: false,
        appShell: false,
        ssr: false,
        prerender: false,
        sourceMap: { scripts: true, vendor: false, styles: false },
        outputHashing: adjustOutputHashing(buildTargetOptions.outputHashing),
        optimization: false,
        tsConfig: normalizedOptions.tsConfig,
        entryPoints,
        externalDependencies: [
            'vitest',
            '@vitest/browser/context',
            ...(buildTargetOptions.externalDependencies ?? []),
        ],
    };
    extensions ??= {};
    extensions.codePlugins ??= [];
    const virtualTestBedInit = (0, virtual_module_plugin_1.createVirtualModulePlugin)({
        namespace: 'angular:test-bed-init',
        loadContent: async () => {
            const contents = [
                // Initialize the Angular testing environment
                `import { NgModule } from '@angular/core';`,
                `import { getTestBed, ɵgetCleanupHook as getCleanupHook } from '@angular/core/testing';`,
                `import { BrowserTestingModule, platformBrowserTesting } from '@angular/platform-browser/testing';`,
                '',
                normalizedOptions.providersFile
                    ? `import providers from './${(0, path_1.toPosixPath)(node_path_1.default
                        .relative(projectSourceRoot, normalizedOptions.providersFile)
                        .replace(/.[mc]?ts$/, ''))}'`
                    : 'const providers = [];',
                '',
                // Same as https://github.com/angular/angular/blob/05a03d3f975771bb59c7eefd37c01fa127ee2229/packages/core/testing/src/test_hooks.ts#L21-L29
                `beforeEach(getCleanupHook(false));`,
                `afterEach(getCleanupHook(true));`,
                '',
                `@NgModule({`,
                `  providers,`,
                `})`,
                `export class TestModule {}`,
                '',
                `getTestBed().initTestEnvironment([BrowserTestingModule, TestModule], platformBrowserTesting(), {`,
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
    extensions.codePlugins.unshift(virtualTestBedInit);
    let instance;
    // Setup vitest browser options if configured
    const { browser, errors } = setupBrowserConfiguration(normalizedOptions.browsers, normalizedOptions.debug, projectSourceRoot);
    if (errors?.length) {
        errors.forEach((error) => context.logger.error(error));
        return { success: false };
    }
    // Add setup file entries for TestBed initialization and project polyfills
    const setupFiles = ['init-testbed.js', ...normalizedOptions.setupFiles];
    if (buildTargetOptions?.polyfills?.length) {
        // Placed first as polyfills may be required by the Testbed initialization
        // or other project provided setup files (e.g., zone.js, ECMAScript polyfills).
        setupFiles.unshift('polyfills.js');
    }
    const debugOptions = normalizedOptions.debug
        ? {
            inspectBrk: true,
            isolate: false,
            fileParallelism: false,
        }
        : {};
    try {
        for await (const result of (0, application_1.buildApplicationInternal)(buildOptions, context, extensions)) {
            if (result.kind === results_1.ResultKind.Failure) {
                continue;
            }
            else if (result.kind !== results_1.ResultKind.Full && result.kind !== results_1.ResultKind.Incremental) {
                node_assert_1.default.fail('A full and/or incremental build result is required from the application builder.');
            }
            (0, node_assert_1.default)(result.files, 'Builder did not provide result files.');
            await (0, application_builder_1.writeTestFiles)(result.files, outputPath);
            instance ??= await startVitest('test', undefined /* cliFilters */, {
                // Disable configuration file resolution/loading
                config: false,
                root: workspaceRoot,
                project: ['base', projectName],
                name: 'base',
                include: [],
                reporters: normalizedOptions.reporters ?? ['default'],
                watch: normalizedOptions.watch,
                coverage: generateCoverageOption(normalizedOptions.codeCoverage, workspaceRoot, outputPath),
                ...debugOptions,
            }, {
                plugins: [
                    {
                        name: 'angular:project-init',
                        async configureVitest(context) {
                            // Create a subproject that can be configured with plugins for browser mode.
                            // Plugins defined directly in the vite overrides will not be present in the
                            // browser specific Vite instance.
                            const [project] = await context.injectTestProjects({
                                test: {
                                    name: projectName,
                                    root: outputPath,
                                    globals: true,
                                    setupFiles,
                                    // Use `jsdom` if no browsers are explicitly configured.
                                    // `node` is effectively no "environment" and the default.
                                    environment: browser ? 'node' : 'jsdom',
                                    browser,
                                },
                                plugins: [
                                    {
                                        name: 'angular:html-index',
                                        transformIndexHtml() {
                                            // Add all global stylesheets
                                            return (Object.entries(result.files)
                                                // TODO: Expand this to all configured global stylesheets
                                                .filter(([file]) => file === 'styles.css')
                                                .map(([styleUrl]) => ({
                                                tag: 'link',
                                                attrs: {
                                                    'href': styleUrl,
                                                    'rel': 'stylesheet',
                                                },
                                                injectTo: 'head',
                                            })));
                                        },
                                    },
                                ],
                            });
                            // Adjust coverage excludes to not include the otherwise automatically inserted included unit tests.
                            // Vite does this as a convenience but is problematic for the bundling strategy employed by the
                            // builder's test setup. To workaround this, the excludes are adjusted here to only automaticallyAdd commentMore actions
                            // exclude the TypeScript source test files.
                            project.config.coverage.exclude = [
                                ...(normalizedOptions.codeCoverage?.exclude ?? []),
                                '**/*.{test,spec}.?(c|m)ts',
                            ];
                        },
                    },
                ],
            });
            // Check if all the tests pass to calculate the result
            const testModules = instance.state.getTestModules();
            yield { success: testModules.every((testModule) => testModule.ok()) };
        }
    }
    finally {
        if (normalizedOptions.watch) {
            // Vitest will automatically close if not using watch mode
            await instance?.close();
        }
    }
}
function findBrowserProvider(projectResolver) {
    // One of these must be installed in the project to use browser testing
    const vitestBuiltinProviders = ['playwright', 'webdriverio'];
    for (const providerName of vitestBuiltinProviders) {
        try {
            projectResolver(providerName);
            return providerName;
        }
        catch { }
    }
}
function normalizeBrowserName(browserName) {
    // Normalize browser names to match Vitest's expectations for headless but also supports karma's names
    // e.g., 'ChromeHeadless' -> 'chrome', 'FirefoxHeadless'
    // and 'Chrome' -> 'chrome', 'Firefox' -> 'firefox'.
    const normalized = browserName.toLowerCase();
    return normalized.replace(/headless$/, '');
}
function setupBrowserConfiguration(browsers, debug, projectSourceRoot) {
    if (browsers === undefined) {
        return {};
    }
    const projectResolver = (0, node_module_1.createRequire)(projectSourceRoot + '/').resolve;
    let errors;
    try {
        projectResolver('@vitest/browser');
    }
    catch {
        errors ??= [];
        errors.push('The "browsers" option requires the "@vitest/browser" package to be installed within the project.' +
            ' Please install this package and rerun the test command.');
    }
    const provider = findBrowserProvider(projectResolver);
    if (!provider) {
        errors ??= [];
        errors.push('The "browsers" option requires either "playwright" or "webdriverio" to be installed within the project.' +
            ' Please install one of these packages and rerun the test command.');
    }
    // Vitest current requires the playwright browser provider to use the inspect-brk option used by "debug"
    if (debug && provider !== 'playwright') {
        errors ??= [];
        errors.push('Debugging browser mode tests currently requires the use of "playwright".' +
            ' Please install this package and rerun the test command.');
    }
    if (errors) {
        return { errors };
    }
    const browser = {
        enabled: true,
        provider,
        headless: browsers.some((name) => name.toLowerCase().includes('headless')),
        instances: browsers.map((browserName) => ({
            browser: normalizeBrowserName(browserName),
        })),
    };
    return { browser };
}
function generateOutputPath() {
    const datePrefix = new Date().toISOString().replaceAll(/[-:.]/g, '');
    const uuidSuffix = (0, node_crypto_1.randomUUID)().slice(0, 8);
    return node_path_1.default.join('dist', 'test-out', `${datePrefix}-${uuidSuffix}`);
}
function generateCoverageOption(codeCoverage, workspaceRoot, outputPath) {
    if (!codeCoverage) {
        return {
            enabled: false,
        };
    }
    return {
        enabled: true,
        excludeAfterRemap: true,
        include: [`${(0, path_1.toPosixPath)(node_path_1.default.relative(workspaceRoot, outputPath))}/**`],
        // Special handling for `reporter` due to an undefined value causing upstream failures
        ...(codeCoverage.reporters
            ? { reporter: codeCoverage.reporters }
            : {}),
    };
}
