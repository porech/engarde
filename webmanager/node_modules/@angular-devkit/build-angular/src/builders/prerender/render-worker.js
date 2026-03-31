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
const node_assert_1 = __importDefault(require("node:assert"));
const fs = __importStar(require("node:fs"));
const path = __importStar(require("node:path"));
const node_worker_threads_1 = require("node:worker_threads");
/**
 * The fully resolved path to the zone.js package that will be loaded during worker initialization.
 * This is passed as workerData when setting up the worker via the `piscina` package.
 */
const { zonePackage } = node_worker_threads_1.workerData;
/**
 * Renders each route in routes and writes them to <outputPath>/<route>/index.html.
 */
async function render({ indexFile, deployUrl, minifyCss, outputPath, serverBundlePath, route, inlineCriticalCss, }) {
    const result = {};
    const browserIndexOutputPath = path.join(outputPath, indexFile);
    const outputFolderPath = path.join(outputPath, route);
    const outputIndexPath = path.join(outputFolderPath, 'index.html');
    const { ɵSERVER_CONTEXT, AppServerModule, renderModule, renderApplication, default: bootstrapAppFn, } = (await Promise.resolve(`${serverBundlePath}`).then(s => __importStar(require(s))));
    (0, node_assert_1.default)(ɵSERVER_CONTEXT, `ɵSERVER_CONTEXT was not exported from: ${serverBundlePath}.`);
    const indexBaseName = fs.existsSync(path.join(outputPath, 'index.original.html'))
        ? 'index.original.html'
        : indexFile;
    const browserIndexInputPath = path.join(outputPath, indexBaseName);
    const document = await fs.promises.readFile(browserIndexInputPath, 'utf8');
    const platformProviders = [
        {
            provide: ɵSERVER_CONTEXT,
            useValue: 'ssg',
        },
    ];
    let html;
    // Render platform server module
    if (isBootstrapFn(bootstrapAppFn)) {
        (0, node_assert_1.default)(renderApplication, `renderApplication was not exported from: ${serverBundlePath}.`);
        html = await renderApplication(bootstrapAppFn, {
            document,
            url: route,
            platformProviders,
        });
    }
    else {
        (0, node_assert_1.default)(renderModule, `renderModule was not exported from: ${serverBundlePath}.`);
        const moduleClass = bootstrapAppFn || AppServerModule;
        (0, node_assert_1.default)(moduleClass, `Neither an AppServerModule nor a bootstrapping function was exported from: ${serverBundlePath}.`);
        html = await renderModule(moduleClass, {
            document,
            url: route,
            extraProviders: platformProviders,
        });
    }
    if (inlineCriticalCss) {
        const { InlineCriticalCssProcessor } = await Promise.resolve().then(() => __importStar(require('@angular/build/private')));
        const inlineCriticalCssProcessor = new InlineCriticalCssProcessor({
            deployUrl: deployUrl,
            minify: minifyCss,
        });
        const { content, warnings, errors } = await inlineCriticalCssProcessor.process(html, {
            outputPath,
        });
        result.errors = errors;
        result.warnings = warnings;
        html = content;
    }
    // This case happens when we are prerendering "/".
    if (browserIndexOutputPath === outputIndexPath) {
        const browserIndexOutputPathOriginal = path.join(outputPath, 'index.original.html');
        fs.renameSync(browserIndexOutputPath, browserIndexOutputPathOriginal);
    }
    fs.mkdirSync(outputFolderPath, { recursive: true });
    fs.writeFileSync(outputIndexPath, html);
    return result;
}
function isBootstrapFn(value) {
    // We can differentiate between a module and a bootstrap function by reading compiler-generated `ɵmod` static property:
    return typeof value === 'function' && !('ɵmod' in value);
}
/**
 * Initializes the worker when it is first created by loading the Zone.js package
 * into the worker instance.
 *
 * @returns A promise resolving to the render function of the worker.
 */
async function initialize() {
    // Setup Zone.js
    await Promise.resolve(`${zonePackage}`).then(s => __importStar(require(s)));
    // Return the render function for use
    return render;
}
/**
 * The default export will be the promise returned by the initialize function.
 * This is awaited by piscina prior to using the Worker.
 */
exports.default = initialize();
