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
exports.statsWarningsToString = statsWarningsToString;
exports.statsErrorsToString = statsErrorsToString;
exports.statsHasErrors = statsHasErrors;
exports.statsHasWarnings = statsHasWarnings;
exports.createWebpackLoggingCallback = createWebpackLoggingCallback;
exports.generateBuildEventStats = generateBuildEventStats;
exports.webpackStatsLogger = webpackStatsLogger;
const private_1 = require("@angular/build/private");
const node_assert_1 = __importDefault(require("node:assert"));
const path = __importStar(require("node:path"));
const utils_1 = require("../../../utils");
const color_1 = require("../../../utils/color");
const async_chunks_1 = require("./async-chunks");
const helpers_1 = require("./helpers");
function getBuildDuration(webpackStats) {
    (0, node_assert_1.default)(webpackStats.builtAt, 'buildAt cannot be undefined');
    (0, node_assert_1.default)(webpackStats.time, 'time cannot be undefined');
    return Date.now() - webpackStats.builtAt + webpackStats.time;
}
function generateBundleStats(info) {
    const rawSize = typeof info.rawSize === 'number' ? info.rawSize : '-';
    const estimatedTransferSize = typeof info.estimatedTransferSize === 'number' ? info.estimatedTransferSize : '-';
    const files = info.files
        ?.filter((f) => !f.endsWith('.map'))
        .map((f) => path.basename(f))
        .join(', ') ?? '';
    const names = info.names?.length ? info.names.join(', ') : '-';
    const initial = !!info.initial;
    return {
        initial,
        stats: [files, names, rawSize, estimatedTransferSize],
    };
}
// We use this cache because we can have multiple builders running in the same process,
// where each builder has different output path.
// Ideally, we should create the logging callback as a factory, but that would need a refactoring.
const runsCache = new Set();
function statsToString(json, 
// eslint-disable-next-line @typescript-eslint/no-explicit-any
statsConfig, budgetFailures) {
    if (!json.chunks?.length) {
        return '';
    }
    const colors = statsConfig.colors;
    const rs = (x) => (colors ? color_1.colors.reset(x) : x);
    const w = (x) => (colors ? color_1.colors.bold.white(x) : x);
    const changedChunksStats = [];
    let unchangedChunkNumber = 0;
    let hasEstimatedTransferSizes = false;
    const isFirstRun = !runsCache.has(json.outputPath || '');
    for (const chunk of json.chunks) {
        // During first build we want to display unchanged chunks
        // but unchanged cached chunks are always marked as not rendered.
        if (!isFirstRun && !chunk.rendered) {
            continue;
        }
        const assets = json.assets?.filter((asset) => chunk.files?.includes(asset.name));
        let rawSize = 0;
        let estimatedTransferSize;
        if (assets) {
            for (const asset of assets) {
                if (asset.name.endsWith('.map')) {
                    continue;
                }
                rawSize += asset.size;
                if (typeof asset.info.estimatedTransferSize === 'number') {
                    if (estimatedTransferSize === undefined) {
                        estimatedTransferSize = 0;
                        hasEstimatedTransferSizes = true;
                    }
                    estimatedTransferSize += asset.info.estimatedTransferSize;
                }
            }
        }
        changedChunksStats.push(generateBundleStats({ ...chunk, rawSize, estimatedTransferSize }));
    }
    unchangedChunkNumber = json.chunks.length - changedChunksStats.length;
    runsCache.add(json.outputPath || '');
    const statsTable = (0, private_1.generateBuildStatsTable)(changedChunksStats, colors, unchangedChunkNumber === 0, hasEstimatedTransferSizes, budgetFailures);
    // In some cases we do things outside of webpack context
    // Such us index generation, service worker augmentation etc...
    // This will correct the time and include these.
    const time = getBuildDuration(json);
    return rs(`\n${statsTable}\n\n` +
        (unchangedChunkNumber > 0 ? `${unchangedChunkNumber} unchanged chunks\n\n` : '') +
        `Build at: ${w(new Date().toISOString())} - Hash: ${w(json.hash || '')} - Time: ${w('' + time)}ms`);
}
function statsWarningsToString(json, statsConfig) {
    const colors = statsConfig.colors;
    const c = (x) => (colors ? color_1.colors.reset.cyan(x) : x);
    const y = (x) => (colors ? color_1.colors.reset.yellow(x) : x);
    const yb = (x) => (colors ? color_1.colors.reset.yellowBright(x) : x);
    const warnings = json.warnings ? [...json.warnings] : [];
    if (json.children) {
        warnings.push(...json.children.map((c) => c.warnings ?? []).reduce((a, b) => [...a, ...b], []));
    }
    let output = '';
    for (const warning of warnings) {
        if (typeof warning === 'string') {
            output += yb(`Warning: ${warning}\n\n`);
        }
        else {
            let file = warning.file || warning.moduleName;
            // Clean up warning paths
            // Ex: ./src/app/styles.scss.webpack[javascript/auto]!=!./node_modules/css-loader/dist/cjs.js....
            // to ./src/app/styles.scss.webpack
            if (file && !statsConfig.errorDetails) {
                const webpackPathIndex = file.indexOf('.webpack[');
                if (webpackPathIndex !== -1) {
                    file = file.substring(0, webpackPathIndex);
                }
            }
            if (file) {
                output += c(file);
                if (warning.loc) {
                    output += ':' + yb(warning.loc);
                }
                output += ' - ';
            }
            if (!/^warning/i.test(warning.message)) {
                output += y('Warning: ');
            }
            output += `${warning.message}\n\n`;
        }
    }
    return output ? '\n' + output : output;
}
function statsErrorsToString(json, statsConfig) {
    const colors = statsConfig.colors;
    const c = (x) => (colors ? color_1.colors.reset.cyan(x) : x);
    const yb = (x) => (colors ? color_1.colors.reset.yellowBright(x) : x);
    const r = (x) => (colors ? color_1.colors.reset.redBright(x) : x);
    const errors = json.errors ? [...json.errors] : [];
    if (json.children) {
        errors.push(...json.children.map((c) => c?.errors || []).reduce((a, b) => [...a, ...b], []));
    }
    let output = '';
    for (const error of errors) {
        if (typeof error === 'string') {
            output += r(`Error: ${error}\n\n`);
        }
        else {
            let file = error.file || error.moduleName;
            // Clean up error paths
            // Ex: ./src/app/styles.scss.webpack[javascript/auto]!=!./node_modules/css-loader/dist/cjs.js....
            // to ./src/app/styles.scss.webpack
            if (file && !statsConfig.errorDetails) {
                const webpackPathIndex = file.indexOf('.webpack[');
                if (webpackPathIndex !== -1) {
                    file = file.substring(0, webpackPathIndex);
                }
            }
            if (file) {
                output += c(file);
                if (error.loc) {
                    output += ':' + yb(error.loc);
                }
                output += ' - ';
            }
            // In most cases webpack will add stack traces to error messages.
            // This below cleans up the error from stacks.
            // See: https://github.com/webpack/webpack/issues/15980
            const index = error.message.search(/[\n\s]+at /);
            const message = statsConfig.errorStack || index === -1 ? error.message : error.message.substring(0, index);
            if (!/^error/i.test(message)) {
                output += r('Error: ');
            }
            output += `${message}\n\n`;
        }
    }
    return output ? '\n' + output : output;
}
function statsHasErrors(json) {
    return !!(json.errors?.length || json.children?.some((c) => c.errors?.length));
}
function statsHasWarnings(json) {
    return !!(json.warnings?.length || json.children?.some((c) => c.warnings?.length));
}
function createWebpackLoggingCallback(options, logger) {
    const { verbose = false, scripts = [], styles = [] } = options;
    const extraEntryPoints = [
        ...(0, helpers_1.normalizeExtraEntryPoints)(styles, 'styles'),
        ...(0, helpers_1.normalizeExtraEntryPoints)(scripts, 'scripts'),
    ];
    return (stats, config) => {
        if (verbose && config.stats !== false) {
            const statsOptions = config.stats === true ? undefined : config.stats;
            logger.info(stats.toString(statsOptions));
        }
        const rawStats = stats.toJson((0, helpers_1.getStatsOptions)(false));
        const webpackStats = {
            ...rawStats,
            chunks: (0, async_chunks_1.markAsyncChunksNonInitial)(rawStats, extraEntryPoints),
        };
        webpackStatsLogger(logger, webpackStats, config);
    };
}
function generateBuildEventStats(webpackStats, browserBuilderOptions) {
    const { chunks = [], assets = [] } = webpackStats;
    let jsSizeInBytes = 0;
    let cssSizeInBytes = 0;
    let initialChunksCount = 0;
    let ngComponentCount = 0;
    let changedChunksCount = 0;
    const allChunksCount = chunks.length;
    const isFirstRun = !runsCache.has(webpackStats.outputPath || '');
    const chunkFiles = new Set();
    for (const chunk of chunks) {
        if (!isFirstRun && chunk.rendered) {
            changedChunksCount++;
        }
        if (chunk.initial) {
            initialChunksCount++;
        }
        for (const file of chunk.files ?? []) {
            chunkFiles.add(file);
        }
    }
    for (const asset of assets) {
        if (asset.name.endsWith('.map') || !chunkFiles.has(asset.name)) {
            continue;
        }
        if (asset.name.endsWith('.js')) {
            jsSizeInBytes += asset.size;
            ngComponentCount += asset.info.ngComponentCount ?? 0;
        }
        else if (asset.name.endsWith('.css')) {
            cssSizeInBytes += asset.size;
        }
    }
    return {
        optimization: !!(0, utils_1.normalizeOptimization)(browserBuilderOptions.optimization).scripts,
        aot: browserBuilderOptions.aot !== false,
        allChunksCount,
        lazyChunksCount: allChunksCount - initialChunksCount,
        initialChunksCount,
        changedChunksCount,
        durationInMs: getBuildDuration(webpackStats),
        cssSizeInBytes,
        jsSizeInBytes,
        ngComponentCount,
    };
}
function webpackStatsLogger(logger, json, config, budgetFailures) {
    logger.info(statsToString(json, config.stats, budgetFailures));
    if (typeof config.stats !== 'object') {
        throw new Error('Invalid Webpack stats configuration.');
    }
    if (statsHasWarnings(json)) {
        logger.warn(statsWarningsToString(json, config.stats));
    }
    if (statsHasErrors(json)) {
        logger.error(statsErrorsToString(json, config.stats));
    }
}
