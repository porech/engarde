"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAngularSsrTransformPlugin = exports.ServerSsrMode = exports.createAngularSetupMiddlewaresPlugin = exports.createRemoveIdPrefixPlugin = exports.createAngularMemoryPlugin = void 0;
var angular_memory_plugin_1 = require("./angular-memory-plugin");
Object.defineProperty(exports, "createAngularMemoryPlugin", { enumerable: true, get: function () { return angular_memory_plugin_1.createAngularMemoryPlugin; } });
var id_prefix_plugin_1 = require("./id-prefix-plugin");
Object.defineProperty(exports, "createRemoveIdPrefixPlugin", { enumerable: true, get: function () { return id_prefix_plugin_1.createRemoveIdPrefixPlugin; } });
var setup_middlewares_plugin_1 = require("./setup-middlewares-plugin");
Object.defineProperty(exports, "createAngularSetupMiddlewaresPlugin", { enumerable: true, get: function () { return setup_middlewares_plugin_1.createAngularSetupMiddlewaresPlugin; } });
Object.defineProperty(exports, "ServerSsrMode", { enumerable: true, get: function () { return setup_middlewares_plugin_1.ServerSsrMode; } });
var ssr_transform_plugin_1 = require("./ssr-transform-plugin");
Object.defineProperty(exports, "createAngularSsrTransformPlugin", { enumerable: true, get: function () { return ssr_transform_plugin_1.createAngularSsrTransformPlugin; } });
