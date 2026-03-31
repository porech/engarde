"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.executeKarmaBuilder = exports.executeUnitTestBuilder = exports.executeNgPackagrBuilder = exports.executeExtractI18nBuilder = exports.executeDevServerBuilder = exports.BuildOutputFileType = exports.buildApplication = void 0;
var application_1 = require("./builders/application");
Object.defineProperty(exports, "buildApplication", { enumerable: true, get: function () { return application_1.buildApplication; } });
var bundler_context_1 = require("./tools/esbuild/bundler-context");
Object.defineProperty(exports, "BuildOutputFileType", { enumerable: true, get: function () { return bundler_context_1.BuildOutputFileType; } });
var dev_server_1 = require("./builders/dev-server");
Object.defineProperty(exports, "executeDevServerBuilder", { enumerable: true, get: function () { return dev_server_1.executeDevServerBuilder; } });
var extract_i18n_1 = require("./builders/extract-i18n");
Object.defineProperty(exports, "executeExtractI18nBuilder", { enumerable: true, get: function () { return extract_i18n_1.execute; } });
var ng_packagr_1 = require("./builders/ng-packagr");
Object.defineProperty(exports, "executeNgPackagrBuilder", { enumerable: true, get: function () { return ng_packagr_1.execute; } });
var unit_test_1 = require("./builders/unit-test");
Object.defineProperty(exports, "executeUnitTestBuilder", { enumerable: true, get: function () { return unit_test_1.execute; } });
var karma_1 = require("./builders/karma");
Object.defineProperty(exports, "executeKarmaBuilder", { enumerable: true, get: function () { return karma_1.execute; } });
