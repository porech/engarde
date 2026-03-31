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
exports.MissingAssetSourceRootException = void 0;
exports.normalizeAssetPatterns = normalizeAssetPatterns;
const node_assert_1 = __importDefault(require("node:assert"));
const node_fs_1 = require("node:fs");
const path = __importStar(require("node:path"));
class MissingAssetSourceRootException extends Error {
    constructor(path) {
        super(`The ${path} asset path must start with the project source root.`);
    }
}
exports.MissingAssetSourceRootException = MissingAssetSourceRootException;
function normalizeAssetPatterns(assetPatterns, workspaceRoot, projectRoot, projectSourceRoot) {
    if (assetPatterns.length === 0) {
        return [];
    }
    // When sourceRoot is not available, we default to ${projectRoot}/src.
    const sourceRoot = projectSourceRoot || path.join(projectRoot, 'src');
    const resolvedSourceRoot = path.resolve(workspaceRoot, sourceRoot);
    return assetPatterns.map((assetPattern) => {
        // Normalize string asset patterns to objects.
        if (typeof assetPattern === 'string') {
            const assetPath = path.normalize(assetPattern);
            const resolvedAssetPath = path.resolve(workspaceRoot, assetPath);
            // Check if the string asset is within sourceRoot.
            if (!resolvedAssetPath.startsWith(resolvedSourceRoot)) {
                throw new MissingAssetSourceRootException(assetPattern);
            }
            let glob, input;
            let isDirectory = false;
            try {
                isDirectory = (0, node_fs_1.statSync)(resolvedAssetPath).isDirectory();
            }
            catch {
                isDirectory = true;
            }
            if (isDirectory) {
                // Folders get a recursive star glob.
                glob = '**/*';
                // Input directory is their original path.
                input = assetPath;
            }
            else {
                // Files are their own glob.
                glob = path.basename(assetPath);
                // Input directory is their original dirname.
                input = path.dirname(assetPath);
            }
            // Output directory for both is the relative path from source root to input.
            const output = path.relative(resolvedSourceRoot, path.resolve(workspaceRoot, input));
            assetPattern = { glob, input, output };
        }
        else {
            assetPattern.output = path.join('.', assetPattern.output ?? '');
        }
        (0, node_assert_1.default)(assetPattern.output !== undefined);
        if (assetPattern.output.startsWith('..')) {
            throw new Error('An asset cannot be written to a location outside of the output path.');
        }
        return assetPattern;
    });
}
