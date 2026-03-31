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
const private_1 = require("@angular/build/private");
const architect_1 = require("@angular-devkit/architect");
const fs = __importStar(require("node:fs"));
const path = __importStar(require("node:path"));
const piscina_1 = __importDefault(require("piscina"));
const utils_1 = require("../../utils");
const error_1 = require("../../utils/error");
const spinner_1 = require("../../utils/spinner");
async function _renderUniversal(options, context, browserResult, serverResult, spinner) {
    // Get browser target options.
    const browserTarget = (0, architect_1.targetFromTargetString)(options.browserTarget);
    const rawBrowserOptions = await context.getTargetOptions(browserTarget);
    const browserBuilderName = await context.getBuilderNameForTarget(browserTarget);
    const browserOptions = await context.validateOptions(rawBrowserOptions, browserBuilderName);
    // Locate zone.js to load in the render worker
    const root = context.workspaceRoot;
    const zonePackage = require.resolve('zone.js', { paths: [root] });
    const projectName = context.target && context.target.project;
    if (!projectName) {
        throw new Error('The builder requires a target.');
    }
    const projectMetadata = await context.getProjectMetadata(projectName);
    const projectRoot = path.join(root, projectMetadata.root ?? '');
    const { styles } = (0, utils_1.normalizeOptimization)(browserOptions.optimization);
    let inlineCriticalCssProcessor;
    if (styles.inlineCritical) {
        const { InlineCriticalCssProcessor } = await Promise.resolve().then(() => __importStar(require('@angular/build/private')));
        inlineCriticalCssProcessor = new InlineCriticalCssProcessor({
            minify: styles.minify,
            deployUrl: browserOptions.deployUrl,
        });
    }
    const renderWorker = new piscina_1.default({
        filename: require.resolve('./render-worker'),
        maxThreads: 1,
        workerData: { zonePackage },
        recordTiming: false,
    });
    try {
        for (const { path: outputPath, baseHref } of browserResult.outputs) {
            const localeDirectory = path.relative(browserResult.baseOutputPath, outputPath);
            const browserIndexOutputPath = path.join(outputPath, 'index.html');
            const indexHtml = await fs.promises.readFile(browserIndexOutputPath, 'utf8');
            const serverBundlePath = await _getServerModuleBundlePath(options, context, serverResult, localeDirectory);
            let html = await renderWorker.run({
                serverBundlePath,
                document: indexHtml,
                url: options.route,
            });
            // Overwrite the client index file.
            const outputIndexPath = options.outputIndexPath
                ? path.join(root, options.outputIndexPath)
                : browserIndexOutputPath;
            if (inlineCriticalCssProcessor) {
                const { content, warnings, errors } = await inlineCriticalCssProcessor.process(html, {
                    outputPath,
                });
                html = content;
                if (warnings.length || errors.length) {
                    spinner.stop();
                    warnings.forEach((m) => context.logger.warn(m));
                    errors.forEach((m) => context.logger.error(m));
                    spinner.start();
                }
            }
            await fs.promises.writeFile(outputIndexPath, html);
            if (browserOptions.serviceWorker) {
                await (0, private_1.augmentAppWithServiceWorker)(projectRoot, root, outputPath, baseHref ?? '/', browserOptions.ngswConfigPath);
            }
        }
    }
    finally {
        await renderWorker.destroy();
    }
    return browserResult;
}
async function _getServerModuleBundlePath(options, context, serverResult, browserLocaleDirectory) {
    if (options.appModuleBundle) {
        return path.join(context.workspaceRoot, options.appModuleBundle);
    }
    const { baseOutputPath = '' } = serverResult;
    const outputPath = path.join(baseOutputPath, browserLocaleDirectory);
    if (!fs.existsSync(outputPath)) {
        throw new Error(`Could not find server output directory: ${outputPath}.`);
    }
    const re = /^main\.(?:[a-zA-Z0-9]{16}\.)?js$/;
    const maybeMain = fs.readdirSync(outputPath).find((x) => re.test(x));
    if (!maybeMain) {
        throw new Error('Could not find the main bundle.');
    }
    return path.join(outputPath, maybeMain);
}
async function _appShellBuilder(options, context) {
    const browserTarget = (0, architect_1.targetFromTargetString)(options.browserTarget);
    const serverTarget = (0, architect_1.targetFromTargetString)(options.serverTarget);
    // Never run the browser target in watch mode.
    // If service worker is needed, it will be added in _renderUniversal();
    const browserOptions = (await context.getTargetOptions(browserTarget));
    const optimization = (0, utils_1.normalizeOptimization)(browserOptions.optimization);
    optimization.styles.inlineCritical = false;
    const browserTargetRun = await context.scheduleTarget(browserTarget, {
        watch: false,
        serviceWorker: false,
        optimization: optimization,
    });
    if (browserTargetRun.info.builderName === '@angular-devkit/build-angular:application') {
        return {
            success: false,
            error: '"@angular-devkit/build-angular:application" has built-in app-shell generation capabilities. ' +
                'The "appShell" option should be used instead.',
        };
    }
    const serverTargetRun = await context.scheduleTarget(serverTarget, {
        watch: false,
    });
    let spinner;
    try {
        const [browserResult, serverResult] = await Promise.all([
            browserTargetRun.result,
            serverTargetRun.result,
        ]);
        if (browserResult.success === false || browserResult.baseOutputPath === undefined) {
            return browserResult;
        }
        else if (serverResult.success === false) {
            return serverResult;
        }
        spinner = new spinner_1.Spinner();
        spinner.start('Generating application shell...');
        const result = await _renderUniversal(options, context, browserResult, serverResult, spinner);
        spinner.succeed('Application shell generation complete.');
        return result;
    }
    catch (err) {
        spinner?.fail('Application shell generation failed.');
        (0, error_1.assertIsError)(err);
        return { success: false, error: err.message };
    }
    finally {
        await Promise.all([browserTargetRun.stop(), serverTargetRun.stop()]);
    }
}
exports.default = (0, architect_1.createBuilder)(_appShellBuilder);
