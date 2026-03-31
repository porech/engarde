"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createChromeDevtoolsMiddleware = exports.createAngularComponentMiddleware = exports.createAngularHeadersMiddleware = exports.createAngularSsrInternalMiddleware = exports.createAngularSsrExternalMiddleware = exports.createAngularIndexHtmlMiddleware = exports.angularHtmlFallbackMiddleware = exports.createAngularAssetsMiddleware = void 0;
var assets_middleware_1 = require("./assets-middleware");
Object.defineProperty(exports, "createAngularAssetsMiddleware", { enumerable: true, get: function () { return assets_middleware_1.createAngularAssetsMiddleware; } });
var html_fallback_middleware_1 = require("./html-fallback-middleware");
Object.defineProperty(exports, "angularHtmlFallbackMiddleware", { enumerable: true, get: function () { return html_fallback_middleware_1.angularHtmlFallbackMiddleware; } });
var index_html_middleware_1 = require("./index-html-middleware");
Object.defineProperty(exports, "createAngularIndexHtmlMiddleware", { enumerable: true, get: function () { return index_html_middleware_1.createAngularIndexHtmlMiddleware; } });
var ssr_middleware_1 = require("./ssr-middleware");
Object.defineProperty(exports, "createAngularSsrExternalMiddleware", { enumerable: true, get: function () { return ssr_middleware_1.createAngularSsrExternalMiddleware; } });
Object.defineProperty(exports, "createAngularSsrInternalMiddleware", { enumerable: true, get: function () { return ssr_middleware_1.createAngularSsrInternalMiddleware; } });
var headers_middleware_1 = require("./headers-middleware");
Object.defineProperty(exports, "createAngularHeadersMiddleware", { enumerable: true, get: function () { return headers_middleware_1.createAngularHeadersMiddleware; } });
var component_middleware_1 = require("./component-middleware");
Object.defineProperty(exports, "createAngularComponentMiddleware", { enumerable: true, get: function () { return component_middleware_1.createAngularComponentMiddleware; } });
var chrome_devtools_middleware_1 = require("./chrome-devtools-middleware");
Object.defineProperty(exports, "createChromeDevtoolsMiddleware", { enumerable: true, get: function () { return chrome_devtools_middleware_1.createChromeDevtoolsMiddleware; } });
