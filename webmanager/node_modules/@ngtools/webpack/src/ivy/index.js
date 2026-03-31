"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.AngularWebpackLoaderPath = exports.imageDomains = exports.AngularWebpackPlugin = exports.default = void 0;
var loader_1 = require("./loader");
Object.defineProperty(exports, "default", { enumerable: true, get: function () { return loader_1.angularWebpackLoader; } });
var plugin_1 = require("./plugin");
Object.defineProperty(exports, "AngularWebpackPlugin", { enumerable: true, get: function () { return plugin_1.AngularWebpackPlugin; } });
Object.defineProperty(exports, "imageDomains", { enumerable: true, get: function () { return plugin_1.imageDomains; } });
exports.AngularWebpackLoaderPath = __filename;
