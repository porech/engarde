"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.useJSONBuildLogs = exports.useTypeChecking = exports.shouldWatchRoot = exports.debugPerformance = exports.useParallelTs = exports.maxWorkers = exports.allowMinify = exports.shouldBeautify = exports.allowMangle = void 0;
const node_os_1 = require("node:os");
function isDisabled(variable) {
    return variable === '0' || variable.toLowerCase() === 'false';
}
function isEnabled(variable) {
    return variable === '1' || variable.toLowerCase() === 'true';
}
function isPresent(variable) {
    return typeof variable === 'string' && variable !== '';
}
// Optimization and mangling
const debugOptimizeVariable = process.env['NG_BUILD_DEBUG_OPTIMIZE'];
const debugOptimize = (() => {
    if (!isPresent(debugOptimizeVariable) || isDisabled(debugOptimizeVariable)) {
        return {
            mangle: true,
            minify: true,
            beautify: false,
        };
    }
    const debugValue = {
        mangle: false,
        minify: false,
        beautify: true,
    };
    if (isEnabled(debugOptimizeVariable)) {
        return debugValue;
    }
    for (const part of debugOptimizeVariable.split(',')) {
        switch (part.trim().toLowerCase()) {
            case 'mangle':
                debugValue.mangle = true;
                break;
            case 'minify':
                debugValue.minify = true;
                break;
            case 'beautify':
                debugValue.beautify = true;
                break;
        }
    }
    return debugValue;
})();
const mangleVariable = process.env['NG_BUILD_MANGLE'];
exports.allowMangle = isPresent(mangleVariable)
    ? !isDisabled(mangleVariable)
    : debugOptimize.mangle;
exports.shouldBeautify = debugOptimize.beautify;
exports.allowMinify = debugOptimize.minify;
/**
 * Some environments, like CircleCI which use Docker report a number of CPUs by the host and not the count of available.
 * This cause `Error: Call retries were exceeded` errors when trying to use them.
 *
 * @see https://github.com/nodejs/node/issues/28762
 * @see https://github.com/webpack-contrib/terser-webpack-plugin/issues/143
 * @see https://ithub.com/angular/angular-cli/issues/16860#issuecomment-588828079
 *
 */
const maxWorkersVariable = process.env['NG_BUILD_MAX_WORKERS'];
exports.maxWorkers = isPresent(maxWorkersVariable)
    ? +maxWorkersVariable
    : Math.min(4, Math.max((0, node_os_1.availableParallelism)() - 1, 1));
const parallelTsVariable = process.env['NG_BUILD_PARALLEL_TS'];
exports.useParallelTs = !isPresent(parallelTsVariable) || !isDisabled(parallelTsVariable);
const debugPerfVariable = process.env['NG_BUILD_DEBUG_PERF'];
exports.debugPerformance = isPresent(debugPerfVariable) && isEnabled(debugPerfVariable);
const watchRootVariable = process.env['NG_BUILD_WATCH_ROOT'];
exports.shouldWatchRoot = isPresent(watchRootVariable) && isEnabled(watchRootVariable);
const typeCheckingVariable = process.env['NG_BUILD_TYPE_CHECK'];
exports.useTypeChecking = !isPresent(typeCheckingVariable) || !isDisabled(typeCheckingVariable);
const buildLogsJsonVariable = process.env['NG_BUILD_LOGS_JSON'];
exports.useJSONBuildLogs = isPresent(buildLogsJsonVariable) && isEnabled(buildLogsJsonVariable);
