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
exports.resolve = resolve;
exports.load = load;
const node_assert_1 = __importDefault(require("node:assert"));
const node_crypto_1 = require("node:crypto");
const node_path_1 = require("node:path");
const node_url_1 = require("node:url");
const javascript_transformer_1 = require("../../../tools/esbuild/javascript-transformer");
/**
 * @note For some unknown reason, setting `globalThis.ngServerMode = true` does not work when using ESM loader hooks.
 */
const NG_SERVER_MODE_INIT_BYTES = new TextEncoder().encode('var ngServerMode=true;');
/**
 * Node.js ESM loader to redirect imports to in memory files.
 * @see: https://nodejs.org/api/esm.html#loaders for more information about loaders.
 */
const MEMORY_URL_SCHEME = 'memory://';
let memoryVirtualRootUrl;
let outputFiles;
const javascriptTransformer = new javascript_transformer_1.JavaScriptTransformer(
// Always enable JIT linking to support applications built with and without AOT.
// In a development environment the additional scope information does not
// have a negative effect unlike production where final output size is relevant.
{ sourcemap: true, jit: true }, 1);
function initialize(data) {
    // This path does not actually exist but is used to overlay the in memory files with the
    // actual filesystem for resolution purposes.
    // A custom URL schema (such as `memory://`) cannot be used for the resolve output because
    // the in-memory files may use `import.meta.url` in ways that assume a file URL.
    // `createRequire` is one example of this usage.
    memoryVirtualRootUrl = (0, node_url_1.pathToFileURL)((0, node_path_1.join)(data.workspaceRoot, `.angular/prerender-root/${(0, node_crypto_1.randomUUID)()}/`)).href;
    outputFiles = data.outputFiles;
}
function resolve(specifier, context, nextResolve) {
    // In-memory files loaded from external code will contain a memory scheme
    if (specifier.startsWith(MEMORY_URL_SCHEME)) {
        let memoryUrl;
        try {
            memoryUrl = new URL(specifier);
        }
        catch {
            node_assert_1.default.fail('External code attempted to use malformed memory scheme: ' + specifier);
        }
        // Resolve with a URL based from the virtual filesystem root
        return {
            format: 'module',
            shortCircuit: true,
            url: new URL(memoryUrl.pathname.slice(1), memoryVirtualRootUrl).href,
        };
    }
    // Use next/default resolve if the parent is not from the virtual root
    if (!context.parentURL?.startsWith(memoryVirtualRootUrl)) {
        return nextResolve(specifier, context);
    }
    // Check for `./` and `../` relative specifiers
    const isRelative = specifier[0] === '.' &&
        (specifier[1] === '/' || (specifier[1] === '.' && specifier[2] === '/'));
    // Relative specifiers from memory file should be based from the parent memory location
    if (isRelative) {
        let specifierUrl;
        try {
            specifierUrl = new URL(specifier, context.parentURL);
        }
        catch { }
        if (specifierUrl?.pathname &&
            Object.hasOwn(outputFiles, specifierUrl.href.slice(memoryVirtualRootUrl.length))) {
            return {
                format: 'module',
                shortCircuit: true,
                url: specifierUrl.href,
            };
        }
        node_assert_1.default.fail(`In-memory ESM relative file should always exist: '${context.parentURL}' --> '${specifier}'`);
    }
    // Update the parent URL to allow for module resolution for the workspace.
    // This handles bare specifiers (npm packages) and absolute paths.
    // Defer to the next hook in the chain, which would be the
    // Node.js default resolve if this is the last user-specified loader.
    return nextResolve(specifier, {
        ...context,
        parentURL: new URL('index.js', memoryVirtualRootUrl).href,
    });
}
async function load(url, context, nextLoad) {
    const { format } = context;
    // Load the file from memory if the URL is based in the virtual root
    if (url.startsWith(memoryVirtualRootUrl)) {
        const source = outputFiles[url.slice(memoryVirtualRootUrl.length)];
        (0, node_assert_1.default)(source !== undefined, 'Resolved in-memory ESM file should always exist: ' + url);
        // In-memory files have already been transformer during bundling and can be returned directly
        return {
            format,
            shortCircuit: true,
            source,
        };
    }
    // Only module files potentially require transformation. Angular libraries that would
    // need linking are ESM only.
    if (format === 'module' && isFileProtocol(url)) {
        const filePath = (0, node_url_1.fileURLToPath)(url);
        let source = await javascriptTransformer.transformFile(filePath);
        if (filePath.includes('@angular/')) {
            // Prepend 'var ngServerMode=true;' to the source.
            source = Buffer.concat([NG_SERVER_MODE_INIT_BYTES, source]);
        }
        return {
            format,
            shortCircuit: true,
            source,
        };
    }
    // Let Node.js handle all other URLs.
    return nextLoad(url);
}
function isFileProtocol(url) {
    return url.startsWith('file://');
}
function handleProcessExit() {
    void javascriptTransformer.close();
}
process.once('exit', handleProcessExit);
process.once('SIGINT', handleProcessExit);
process.once('uncaughtException', handleProcessExit);
