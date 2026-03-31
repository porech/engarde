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
exports.execute = execute;
const private_1 = require("@angular/build/private");
const architect_1 = require("@angular-devkit/architect");
const node_path_1 = require("node:path");
const rxjs_1 = require("rxjs");
const normalize_cache_1 = require("../../utils/normalize-cache");
/**
 * @experimental Direct usage of this function is considered experimental.
 */
function execute(options, context) {
    return (0, rxjs_1.from)((async () => {
        // Purge old build disk cache.
        await (0, private_1.purgeStaleBuildCache)(context);
        const root = context.workspaceRoot;
        const packager = (await Promise.resolve().then(() => __importStar(require('ng-packagr')))).ngPackagr();
        packager.forProject((0, node_path_1.resolve)(root, options.project));
        if (options.tsConfig) {
            packager.withTsConfig((0, node_path_1.resolve)(root, options.tsConfig));
        }
        const projectName = context.target?.project;
        if (!projectName) {
            throw new Error('The builder requires a target.');
        }
        const metadata = await context.getProjectMetadata(projectName);
        const { enabled: cacheEnabled, path: cacheDirectory } = (0, normalize_cache_1.normalizeCacheOptions)(metadata, context.workspaceRoot);
        const ngPackagrOptions = {
            cacheEnabled,
            poll: options.poll,
            cacheDirectory: (0, node_path_1.join)(cacheDirectory, 'ng-packagr'),
        };
        return { packager, ngPackagrOptions };
    })()).pipe((0, rxjs_1.switchMap)(({ packager, ngPackagrOptions }) => options.watch ? packager.watch(ngPackagrOptions) : packager.build(ngPackagrOptions)), (0, rxjs_1.map)(() => ({ success: true })), (0, rxjs_1.catchError)((err) => (0, rxjs_1.of)({ success: false, error: err.message })));
}
exports.default = (0, architect_1.createBuilder)(execute);
