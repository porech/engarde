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
const node_path_1 = require("node:path");
const error_1 = require("../../utils/error");
const normalize_cache_1 = require("../../utils/normalize-cache");
const purge_cache_1 = require("../../utils/purge-cache");
/**
 * A Builder that executes the `ng-packagr` tool to build an Angular library.
 *
 * @param options The builder options as defined by the JSON schema.
 * @param context A BuilderContext instance.
 * @returns A BuilderOutput object.
 *
 * @experimental Direct usage of this function is considered experimental.
 */
async function* execute(options, context) {
    // Purge old build disk cache.
    await (0, purge_cache_1.purgeStaleBuildCache)(context);
    const workspaceRoot = context.workspaceRoot;
    let packager;
    try {
        packager = (await Promise.resolve().then(() => __importStar(require('ng-packagr')))).ngPackagr();
    }
    catch (error) {
        (0, error_1.assertIsError)(error);
        if (error.code === 'MODULE_NOT_FOUND') {
            return {
                success: false,
                error: 'The "ng-packagr" package was not found. To correct this error, ensure this package is installed in the project.',
            };
        }
        throw error;
    }
    const projectName = context.target?.project;
    if (!projectName) {
        throw new Error('The builder requires a target.');
    }
    const metadata = await context.getProjectMetadata(projectName);
    const ngPackagrConfig = options.project
        ? (0, node_path_1.join)(workspaceRoot, options.project)
        : (0, node_path_1.join)(workspaceRoot, metadata.root ?? '', 'ng-package.json');
    packager.forProject(ngPackagrConfig);
    if (options.tsConfig) {
        packager.withTsConfig((0, node_path_1.resolve)(workspaceRoot, options.tsConfig));
    }
    const { enabled: cacheEnabled, path: cacheDirectory } = (0, normalize_cache_1.normalizeCacheOptions)(metadata, context.workspaceRoot);
    const ngPackagrOptions = {
        cacheEnabled,
        poll: options.poll,
        cacheDirectory: (0, node_path_1.join)(cacheDirectory, 'ng-packagr'),
    };
    try {
        if (options.watch) {
            await packager.watch(ngPackagrOptions).toPromise();
        }
        else {
            await packager.build(ngPackagrOptions);
        }
        yield { success: true };
    }
    catch (error) {
        (0, error_1.assertIsError)(error);
        yield { success: false, error: error.message };
    }
}
