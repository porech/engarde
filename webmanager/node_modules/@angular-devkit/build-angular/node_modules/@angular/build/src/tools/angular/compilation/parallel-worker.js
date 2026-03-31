"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initialize = initialize;
exports.diagnose = diagnose;
exports.emit = emit;
exports.update = update;
const node_assert_1 = __importDefault(require("node:assert"));
const node_crypto_1 = require("node:crypto");
const node_worker_threads_1 = require("node:worker_threads");
const source_file_cache_1 = require("../../esbuild/angular/source-file-cache");
const aot_compilation_1 = require("./aot-compilation");
const jit_compilation_1 = require("./jit-compilation");
let compilation;
const sourceFileCache = new source_file_cache_1.SourceFileCache();
async function initialize(request) {
    compilation ??= request.jit
        ? new jit_compilation_1.JitCompilation(request.browserOnlyBuild)
        : new aot_compilation_1.AotCompilation(request.browserOnlyBuild);
    const stylesheetRequests = new Map();
    request.stylesheetPort.on('message', ({ requestId, value, error }) => {
        if (error) {
            stylesheetRequests.get(requestId)?.[1](error);
        }
        else {
            stylesheetRequests.get(requestId)?.[0](value);
        }
    });
    const { compilerOptions, referencedFiles, externalStylesheets, templateUpdates } = await compilation.initialize(request.tsconfig, {
        fileReplacements: request.fileReplacements,
        sourceFileCache,
        modifiedFiles: sourceFileCache.modifiedFiles,
        transformStylesheet(data, containingFile, stylesheetFile, order, className) {
            const requestId = (0, node_crypto_1.randomUUID)();
            const resultPromise = new Promise((resolve, reject) => stylesheetRequests.set(requestId, [resolve, reject]));
            request.stylesheetPort.postMessage({
                requestId,
                data,
                containingFile,
                stylesheetFile,
                order,
                className,
            });
            return resultPromise;
        },
        processWebWorker(workerFile, containingFile) {
            Atomics.store(request.webWorkerSignal, 0, 0);
            request.webWorkerPort.postMessage({ workerFile, containingFile });
            Atomics.wait(request.webWorkerSignal, 0, 0);
            const result = (0, node_worker_threads_1.receiveMessageOnPort)(request.webWorkerPort)?.message;
            if (result?.error) {
                throw result.error;
            }
            return result?.workerCodeFile ?? workerFile;
        },
    }, (compilerOptions) => {
        Atomics.store(request.optionsSignal, 0, 0);
        request.optionsPort.postMessage(compilerOptions);
        Atomics.wait(request.optionsSignal, 0, 0);
        const result = (0, node_worker_threads_1.receiveMessageOnPort)(request.optionsPort)?.message;
        if (result?.error) {
            throw result.error;
        }
        return result?.transformedOptions ?? compilerOptions;
    });
    return {
        externalStylesheets,
        templateUpdates,
        referencedFiles,
        // TODO: Expand? `allowJs`, `isolatedModules`, `sourceMap`, `inlineSourceMap` are the only fields needed currently.
        compilerOptions: {
            allowJs: compilerOptions.allowJs,
            isolatedModules: compilerOptions.isolatedModules,
            sourceMap: compilerOptions.sourceMap,
            inlineSourceMap: compilerOptions.inlineSourceMap,
        },
    };
}
async function diagnose(modes) {
    (0, node_assert_1.default)(compilation);
    const diagnostics = await compilation.diagnoseFiles(modes);
    return diagnostics;
}
async function emit() {
    (0, node_assert_1.default)(compilation);
    const files = await compilation.emitAffectedFiles();
    return [...files];
}
function update(files) {
    sourceFileCache.invalidate(files);
}
