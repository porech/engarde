"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildApplicationInternal = exports.transformSupportedBrowsersToTargets = exports.getSupportedBrowsers = exports.purgeStaleBuildCache = exports.isZonelessApp = exports.getFeatureSupport = exports.JavaScriptTransformer = exports.createRxjsEsmResolutionPlugin = exports.BuildOutputFileType = void 0;
var bundler_context_1 = require("../../tools/esbuild/bundler-context");
Object.defineProperty(exports, "BuildOutputFileType", { enumerable: true, get: function () { return bundler_context_1.BuildOutputFileType; } });
var rxjs_esm_resolution_plugin_1 = require("../../tools/esbuild/rxjs-esm-resolution-plugin");
Object.defineProperty(exports, "createRxjsEsmResolutionPlugin", { enumerable: true, get: function () { return rxjs_esm_resolution_plugin_1.createRxjsEsmResolutionPlugin; } });
var javascript_transformer_1 = require("../../tools/esbuild/javascript-transformer");
Object.defineProperty(exports, "JavaScriptTransformer", { enumerable: true, get: function () { return javascript_transformer_1.JavaScriptTransformer; } });
var utils_1 = require("../../tools/esbuild/utils");
Object.defineProperty(exports, "getFeatureSupport", { enumerable: true, get: function () { return utils_1.getFeatureSupport; } });
Object.defineProperty(exports, "isZonelessApp", { enumerable: true, get: function () { return utils_1.isZonelessApp; } });
var purge_cache_1 = require("../../utils/purge-cache");
Object.defineProperty(exports, "purgeStaleBuildCache", { enumerable: true, get: function () { return purge_cache_1.purgeStaleBuildCache; } });
var supported_browsers_1 = require("../../utils/supported-browsers");
Object.defineProperty(exports, "getSupportedBrowsers", { enumerable: true, get: function () { return supported_browsers_1.getSupportedBrowsers; } });
var utils_2 = require("../../tools/esbuild/utils");
Object.defineProperty(exports, "transformSupportedBrowsersToTargets", { enumerable: true, get: function () { return utils_2.transformSupportedBrowsersToTargets; } });
var application_1 = require("../../builders/application");
Object.defineProperty(exports, "buildApplicationInternal", { enumerable: true, get: function () { return application_1.buildApplicationInternal; } });
