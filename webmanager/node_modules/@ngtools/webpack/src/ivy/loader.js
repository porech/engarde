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
Object.defineProperty(exports, "__esModule", { value: true });
exports.angularWebpackLoader = angularWebpackLoader;
exports.default = angularWebpackLoader;
const path = __importStar(require("node:path"));
const symbol_1 = require("./symbol");
const JS_FILE_REGEXP = /\.[cm]?js$/;
function angularWebpackLoader(content, map) {
    const callback = this.async();
    if (!callback) {
        throw new Error('Invalid webpack version');
    }
    const fileEmitter = this[symbol_1.AngularPluginSymbol];
    if (!fileEmitter || typeof fileEmitter !== 'object') {
        if (JS_FILE_REGEXP.test(this.resourcePath)) {
            // Passthrough for JS files when no plugin is used
            this.callback(undefined, content, map);
            return;
        }
        callback(new Error('The Angular Webpack loader requires the AngularWebpackPlugin.'));
        return;
    }
    fileEmitter
        .emit(this.resourcePath)
        .then((result) => {
        if (!result) {
            if (JS_FILE_REGEXP.test(this.resourcePath)) {
                // Return original content for JS files if not compiled by TypeScript ("allowJs")
                this.callback(undefined, content, map);
            }
            else {
                // File is not part of the compilation
                const message = `${this.resourcePath} is missing from the TypeScript compilation. ` +
                    `Please make sure it is in your tsconfig via the 'files' or 'include' property.`;
                callback(new Error(message));
            }
            return;
        }
        result.dependencies.forEach((dependency) => this.addDependency(dependency));
        let resultContent = result.content || '';
        let resultMap;
        if (result.map) {
            resultContent = resultContent.replace(/^\/\/# sourceMappingURL=[^\r\n]*/gm, '');
            resultMap = JSON.parse(result.map);
            resultMap.sources = resultMap.sources.map((source) => path.join(path.dirname(this.resourcePath), source));
        }
        callback(undefined, resultContent, resultMap);
    })
        .catch((err) => {
        // The below is needed to hide stacktraces from users.
        const message = err instanceof Error ? err.message : err;
        callback(new Error(message));
    });
}
