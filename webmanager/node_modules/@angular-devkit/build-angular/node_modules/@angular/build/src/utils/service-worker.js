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
exports.augmentAppWithServiceWorker = augmentAppWithServiceWorker;
exports.augmentAppWithServiceWorkerEsbuild = augmentAppWithServiceWorkerEsbuild;
exports.augmentAppWithServiceWorkerCore = augmentAppWithServiceWorkerCore;
const crypto = __importStar(require("node:crypto"));
const node_fs_1 = require("node:fs");
const path = __importStar(require("node:path"));
const bundler_context_1 = require("../tools/esbuild/bundler-context");
const error_1 = require("./error");
const load_esm_1 = require("./load-esm");
const path_1 = require("./path");
class CliFilesystem {
    fs;
    base;
    constructor(fs, base) {
        this.fs = fs;
        this.base = base;
    }
    list(dir) {
        return this._recursiveList(this._resolve(dir), []);
    }
    read(file) {
        return this.fs.readFile(this._resolve(file), 'utf-8');
    }
    async hash(file) {
        return crypto
            .createHash('sha1')
            .update(await this.fs.readFile(this._resolve(file)))
            .digest('hex');
    }
    write(_file, _content) {
        throw new Error('This should never happen.');
    }
    _resolve(file) {
        return path.join(this.base, file);
    }
    async _recursiveList(dir, items) {
        const subdirectories = [];
        for (const entry of await this.fs.readdir(dir)) {
            const entryPath = path.join(dir, entry);
            const stats = await this.fs.stat(entryPath);
            if (stats.isFile()) {
                // Uses posix paths since the service worker expects URLs
                items.push('/' + (0, path_1.toPosixPath)(path.relative(this.base, entryPath)));
            }
            else if (stats.isDirectory()) {
                subdirectories.push(entryPath);
            }
        }
        for (const subdirectory of subdirectories) {
            await this._recursiveList(subdirectory, items);
        }
        return items;
    }
}
class ResultFilesystem {
    fileReaders = new Map();
    constructor(outputFiles, assetFiles) {
        for (const file of outputFiles) {
            if (file.type === bundler_context_1.BuildOutputFileType.Media || file.type === bundler_context_1.BuildOutputFileType.Browser) {
                this.fileReaders.set('/' + (0, path_1.toPosixPath)(file.path), async () => file.contents);
            }
        }
        for (const file of assetFiles) {
            this.fileReaders.set('/' + (0, path_1.toPosixPath)(file.destination), () => node_fs_1.promises.readFile(file.source));
        }
    }
    async list(dir) {
        if (dir !== '/') {
            throw new Error('Serviceworker manifest generator should only list files from root.');
        }
        return [...this.fileReaders.keys()];
    }
    async read(file) {
        const reader = this.fileReaders.get(file);
        if (reader === undefined) {
            throw new Error('File does not exist.');
        }
        const contents = await reader();
        return Buffer.from(contents.buffer, contents.byteOffset, contents.byteLength).toString('utf-8');
    }
    async hash(file) {
        const reader = this.fileReaders.get(file);
        if (reader === undefined) {
            throw new Error('File does not exist.');
        }
        return crypto
            .createHash('sha1')
            .update(await reader())
            .digest('hex');
    }
    write() {
        throw new Error('Serviceworker manifest generator should not attempted to write.');
    }
}
async function augmentAppWithServiceWorker(appRoot, workspaceRoot, outputPath, baseHref, ngswConfigPath, inputFileSystem = node_fs_1.promises, outputFileSystem = node_fs_1.promises) {
    // Determine the configuration file path
    const configPath = ngswConfigPath
        ? path.join(workspaceRoot, ngswConfigPath)
        : path.join(appRoot, 'ngsw-config.json');
    // Read the configuration file
    let config;
    try {
        const configurationData = await inputFileSystem.readFile(configPath, 'utf-8');
        config = JSON.parse(configurationData);
    }
    catch (error) {
        (0, error_1.assertIsError)(error);
        if (error.code === 'ENOENT') {
            throw new Error('Error: Expected to find an ngsw-config.json configuration file' +
                ` in the ${appRoot} folder. Either provide one or` +
                ' disable Service Worker in the angular.json configuration file.');
        }
        else {
            throw error;
        }
    }
    const result = await augmentAppWithServiceWorkerCore(config, new CliFilesystem(outputFileSystem, outputPath), baseHref);
    const copy = async (src, dest) => {
        const resolvedDest = path.join(outputPath, dest);
        return outputFileSystem.writeFile(resolvedDest, await inputFileSystem.readFile(src));
    };
    await outputFileSystem.writeFile(path.join(outputPath, 'ngsw.json'), result.manifest);
    for (const { source, destination } of result.assetFiles) {
        await copy(source, destination);
    }
}
// This is currently used by the esbuild-based builder
async function augmentAppWithServiceWorkerEsbuild(workspaceRoot, configPath, baseHref, indexHtml, outputFiles, assetFiles) {
    // Read the configuration file
    let config;
    try {
        const configurationData = await node_fs_1.promises.readFile(configPath, 'utf-8');
        config = JSON.parse(configurationData);
        if (indexHtml) {
            config.index = indexHtml;
        }
    }
    catch (error) {
        (0, error_1.assertIsError)(error);
        if (error.code === 'ENOENT') {
            // TODO: Generate an error object that can be consumed by the esbuild-based builder
            const message = `Service worker configuration file "${path.relative(workspaceRoot, configPath)}" could not be found.`;
            throw new Error(message);
        }
        else {
            throw error;
        }
    }
    return augmentAppWithServiceWorkerCore(config, new ResultFilesystem(outputFiles, assetFiles), baseHref);
}
async function augmentAppWithServiceWorkerCore(config, serviceWorkerFilesystem, baseHref) {
    // Load ESM `@angular/service-worker/config` using the TypeScript dynamic import workaround.
    // Once TypeScript provides support for keeping the dynamic import this workaround can be
    // changed to a direct dynamic import.
    const GeneratorConstructor = (await (0, load_esm_1.loadEsmModule)('@angular/service-worker/config')).Generator;
    // Generate the manifest
    const generator = new GeneratorConstructor(serviceWorkerFilesystem, baseHref);
    const output = await generator.process(config);
    // Write the manifest
    const manifest = JSON.stringify(output, null, 2);
    // Find the service worker package
    const workerPath = require.resolve('@angular/service-worker/ngsw-worker.js');
    const result = {
        manifest,
        // Main worker code
        assetFiles: [{ source: workerPath, destination: 'ngsw-worker.js' }],
    };
    // If present, write the safety worker code
    const safetyPath = path.join(path.dirname(workerPath), 'safety-worker.js');
    if ((0, node_fs_1.existsSync)(safetyPath)) {
        result.assetFiles.push({ source: safetyPath, destination: 'worker-basic.min.js' });
        result.assetFiles.push({ source: safetyPath, destination: 'safety-worker.js' });
    }
    return result;
}
