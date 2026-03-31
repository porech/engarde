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
const private_1 = require("@angular/build/private");
const architect_1 = require("@angular-devkit/architect");
const fs = __importStar(require("node:fs"));
const promises_1 = require("node:fs/promises");
const path = __importStar(require("node:path"));
const ora_1 = __importDefault(require("ora"));
const piscina_1 = __importDefault(require("piscina"));
const utils_1 = require("../../utils");
const environment_options_1 = require("../../utils/environment-options");
const error_1 = require("../../utils/error");
const webpack_browser_config_1 = require("../../utils/webpack-browser-config");
class RoutesSet extends Set {
    add(value) {
        return super.add(value.charAt(0) === '/' ? value.slice(1) : value);
    }
}
async function getRoutes(indexFile, outputPath, serverBundlePath, options, workspaceRoot) {
    const { routes: extraRoutes = [], routesFile, discoverRoutes } = options;
    const routes = new RoutesSet(extraRoutes);
    if (routesFile) {
        const routesFromFile = (await (0, promises_1.readFile)(path.join(workspaceRoot, routesFile), 'utf8')).split(/\r?\n/);
        for (const route of routesFromFile) {
            routes.add(route);
        }
    }
    if (discoverRoutes) {
        const renderWorker = new piscina_1.default({
            filename: require.resolve('./routes-extractor-worker'),
            maxThreads: 1,
            workerData: {
                indexFile,
                outputPath,
                serverBundlePath,
                zonePackage: require.resolve('zone.js', { paths: [workspaceRoot] }),
            },
            recordTiming: false,
        });
        const extractedRoutes = await renderWorker
            .run({})
            .finally(() => void renderWorker.destroy());
        for (const route of extractedRoutes) {
            routes.add(route);
        }
    }
    if (routes.size === 0) {
        throw new Error('Could not find any routes to prerender.');
    }
    return [...routes];
}
/**
 * Schedules the server and browser builds and returns their results if both builds are successful.
 */
async function _scheduleBuilds(options, context) {
    const browserTarget = (0, architect_1.targetFromTargetString)(options.browserTarget);
    const serverTarget = (0, architect_1.targetFromTargetString)(options.serverTarget);
    const browserTargetRun = await context.scheduleTarget(browserTarget, {
        watch: false,
        serviceWorker: false,
        // todo: handle service worker augmentation
    });
    if (browserTargetRun.info.builderName === '@angular-devkit/build-angular:application') {
        return {
            success: false,
            error: '"@angular-devkit/build-angular:application" has built-in prerendering capabilities. ' +
                'The "prerender" option should be used instead.',
        };
    }
    const serverTargetRun = await context.scheduleTarget(serverTarget, {
        watch: false,
    });
    try {
        const [browserResult, serverResult] = await Promise.all([
            browserTargetRun.result,
            serverTargetRun.result,
        ]);
        const success = browserResult.success && serverResult.success && browserResult.baseOutputPath !== undefined;
        const error = browserResult.error || serverResult.error;
        return { success, error, browserResult, serverResult };
    }
    catch (e) {
        (0, error_1.assertIsError)(e);
        return { success: false, error: e.message };
    }
    finally {
        await Promise.all([browserTargetRun.stop(), serverTargetRun.stop()]);
    }
}
/**
 * Renders each route and writes them to
 * <route>/index.html for each output path in the browser result.
 */
async function _renderUniversal(options, context, browserResult, serverResult, browserOptions) {
    const projectName = context.target && context.target.project;
    if (!projectName) {
        throw new Error('The builder requires a target.');
    }
    const projectMetadata = await context.getProjectMetadata(projectName);
    const projectRoot = path.join(context.workspaceRoot, projectMetadata.root ?? '');
    // Users can specify a different base html file e.g. "src/home.html"
    const indexFile = (0, webpack_browser_config_1.getIndexOutputFile)(browserOptions.index);
    const { styles: normalizedStylesOptimization } = (0, utils_1.normalizeOptimization)(browserOptions.optimization);
    const zonePackage = require.resolve('zone.js', { paths: [context.workspaceRoot] });
    const { baseOutputPath = '' } = serverResult;
    const worker = new piscina_1.default({
        filename: path.join(__dirname, 'render-worker.js'),
        maxThreads: environment_options_1.maxWorkers,
        workerData: { zonePackage },
        recordTiming: false,
    });
    let routes;
    try {
        // We need to render the routes for each locale from the browser output.
        for (const { path: outputPath } of browserResult.outputs) {
            const localeDirectory = path.relative(browserResult.baseOutputPath, outputPath);
            const serverBundlePath = path.join(baseOutputPath, localeDirectory, 'main.js');
            if (!fs.existsSync(serverBundlePath)) {
                throw new Error(`Could not find the main bundle: ${serverBundlePath}`);
            }
            routes ??= await getRoutes(indexFile, outputPath, serverBundlePath, options, context.workspaceRoot);
            const spinner = (0, ora_1.default)(`Prerendering ${routes.length} route(s) to ${outputPath}...`).start();
            try {
                const results = (await Promise.all(routes.map((route) => {
                    const options = {
                        indexFile,
                        deployUrl: browserOptions.deployUrl || '',
                        inlineCriticalCss: !!normalizedStylesOptimization.inlineCritical,
                        minifyCss: !!normalizedStylesOptimization.minify,
                        outputPath,
                        route,
                        serverBundlePath,
                    };
                    return worker.run(options);
                })));
                let numErrors = 0;
                for (const { errors, warnings } of results) {
                    spinner.stop();
                    errors?.forEach((e) => context.logger.error(e));
                    warnings?.forEach((e) => context.logger.warn(e));
                    spinner.start();
                    numErrors += errors?.length ?? 0;
                }
                if (numErrors > 0) {
                    throw Error(`Rendering failed with ${numErrors} worker errors.`);
                }
            }
            catch (error) {
                spinner.fail(`Prerendering routes to ${outputPath} failed.`);
                (0, error_1.assertIsError)(error);
                return { success: false, error: error.message };
            }
            spinner.succeed(`Prerendering routes to ${outputPath} complete.`);
            if (browserOptions.serviceWorker) {
                spinner.start('Generating service worker...');
                try {
                    await (0, private_1.augmentAppWithServiceWorker)(projectRoot, context.workspaceRoot, outputPath, browserOptions.baseHref || '/', browserOptions.ngswConfigPath);
                }
                catch (error) {
                    spinner.fail('Service worker generation failed.');
                    (0, error_1.assertIsError)(error);
                    return { success: false, error: error.message };
                }
                spinner.succeed('Service worker generation complete.');
            }
        }
    }
    finally {
        void worker.destroy();
    }
    return browserResult;
}
/**
 * Builds the browser and server, then renders each route in options.routes
 * and writes them to prerender/<route>/index.html for each output path in
 * the browser result.
 */
async function execute(options, context) {
    const browserTarget = (0, architect_1.targetFromTargetString)(options.browserTarget);
    const browserOptions = (await context.getTargetOptions(browserTarget));
    const result = await _scheduleBuilds(options, context);
    const { success, error, browserResult, serverResult } = result;
    if (!success || !browserResult || !serverResult) {
        return { success, error };
    }
    return _renderUniversal(options, context, browserResult, serverResult, browserOptions);
}
exports.default = (0, architect_1.createBuilder)(execute);
