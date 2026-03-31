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
exports.SourceFileCache = void 0;
const node_os_1 = require("node:os");
const path = __importStar(require("node:path"));
const load_result_cache_1 = require("../load-result-cache");
const USING_WINDOWS = (0, node_os_1.platform)() === 'win32';
const WINDOWS_SEP_REGEXP = new RegExp(`\\${path.win32.sep}`, 'g');
class SourceFileCache extends Map {
    persistentCachePath;
    modifiedFiles = new Set();
    typeScriptFileCache = new Map();
    loadResultCache = new load_result_cache_1.MemoryLoadResultCache();
    referencedFiles;
    constructor(persistentCachePath) {
        super();
        this.persistentCachePath = persistentCachePath;
    }
    invalidate(files) {
        if (files !== this.modifiedFiles) {
            this.modifiedFiles.clear();
        }
        const extraWatchFiles = new Set(this.referencedFiles?.map(path.normalize));
        let invalid = false;
        for (let file of files) {
            file = path.normalize(file);
            invalid = this.loadResultCache.invalidate(file) || invalid;
            invalid = extraWatchFiles.has(file) || invalid;
            // Normalize separators to allow matching TypeScript Host paths
            if (USING_WINDOWS) {
                file = file.replace(WINDOWS_SEP_REGEXP, path.posix.sep);
            }
            invalid = this.delete(file) || invalid;
            this.modifiedFiles.add(file);
        }
        return invalid;
    }
}
exports.SourceFileCache = SourceFileCache;
