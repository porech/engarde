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
exports.loadProxyConfiguration = loadProxyConfiguration;
const node_fs_1 = require("node:fs");
const promises_1 = require("node:fs/promises");
const node_path_1 = require("node:path");
const node_url_1 = require("node:url");
const picomatch_1 = require("picomatch");
const tinyglobby_1 = require("tinyglobby");
const error_1 = require("./error");
const load_esm_1 = require("./load-esm");
async function loadProxyConfiguration(root, proxyConfig) {
    if (!proxyConfig) {
        return undefined;
    }
    const proxyPath = (0, node_path_1.resolve)(root, proxyConfig);
    if (!(0, node_fs_1.existsSync)(proxyPath)) {
        throw new Error(`Proxy configuration file ${proxyPath} does not exist.`);
    }
    let proxyConfiguration;
    switch ((0, node_path_1.extname)(proxyPath)) {
        case '.json': {
            const content = await (0, promises_1.readFile)(proxyPath, 'utf-8');
            const { parse, printParseErrorCode } = await Promise.resolve().then(() => __importStar(require('jsonc-parser')));
            const parseErrors = [];
            proxyConfiguration = parse(content, parseErrors, { allowTrailingComma: true });
            if (parseErrors.length > 0) {
                let errorMessage = `Proxy configuration file ${proxyPath} contains parse errors:`;
                for (const parseError of parseErrors) {
                    const { line, column } = getJsonErrorLineColumn(parseError.offset, content);
                    errorMessage += `\n[${line}, ${column}] ${printParseErrorCode(parseError.error)}`;
                }
                throw new Error(errorMessage);
            }
            break;
        }
        case '.mjs':
            // Load the ESM configuration file using the TypeScript dynamic import workaround.
            // Once TypeScript provides support for keeping the dynamic import this workaround can be
            // changed to a direct dynamic import.
            proxyConfiguration = await (0, load_esm_1.loadEsmModule)((0, node_url_1.pathToFileURL)(proxyPath));
            break;
        case '.cjs':
            proxyConfiguration = require(proxyPath);
            break;
        default:
            // The file could be either CommonJS or ESM.
            // CommonJS is tried first then ESM if loading fails.
            try {
                proxyConfiguration = require(proxyPath);
                break;
            }
            catch (e) {
                (0, error_1.assertIsError)(e);
                if (e.code === 'ERR_REQUIRE_ESM' || e.code === 'ERR_REQUIRE_ASYNC_MODULE') {
                    // Load the ESM configuration file using the TypeScript dynamic import workaround.
                    // Once TypeScript provides support for keeping the dynamic import this workaround can be
                    // changed to a direct dynamic import.
                    proxyConfiguration = await (0, load_esm_1.loadEsmModule)((0, node_url_1.pathToFileURL)(proxyPath));
                    break;
                }
                throw e;
            }
    }
    if ('default' in proxyConfiguration) {
        proxyConfiguration = proxyConfiguration.default;
    }
    return normalizeProxyConfiguration(proxyConfiguration);
}
/**
 * Converts glob patterns to regular expressions to support Vite's proxy option.
 * Also converts the Webpack supported array form to an object form supported by both.
 *
 * @param proxy A proxy configuration object.
 */
function normalizeProxyConfiguration(proxy) {
    let normalizedProxy;
    if (Array.isArray(proxy)) {
        // Construct an object-form proxy configuration from the array
        normalizedProxy = {};
        for (const proxyEntry of proxy) {
            if (!('context' in proxyEntry)) {
                continue;
            }
            if (!Array.isArray(proxyEntry.context)) {
                continue;
            }
            // Array-form entries contain a context string array with the path(s)
            // to use for the configuration entry.
            const context = proxyEntry.context;
            delete proxyEntry.context;
            for (const contextEntry of context) {
                if (typeof contextEntry !== 'string') {
                    continue;
                }
                normalizedProxy[contextEntry] = proxyEntry;
            }
        }
    }
    else {
        normalizedProxy = proxy;
    }
    // TODO: Consider upstreaming glob support
    for (const key of Object.keys(normalizedProxy)) {
        if (key[0] !== '^' && (0, tinyglobby_1.isDynamicPattern)(key)) {
            const pattern = (0, picomatch_1.makeRe)(key).source;
            normalizedProxy[pattern] = normalizedProxy[key];
            delete normalizedProxy[key];
        }
    }
    // Replace `pathRewrite` field with a `rewrite` function
    for (const proxyEntry of Object.values(normalizedProxy)) {
        if (typeof proxyEntry === 'object' &&
            'pathRewrite' in proxyEntry &&
            proxyEntry.pathRewrite &&
            typeof proxyEntry.pathRewrite === 'object') {
            // Preprocess path rewrite entries
            const pathRewriteEntries = [];
            for (const [pattern, value] of Object.entries(proxyEntry.pathRewrite)) {
                pathRewriteEntries.push([new RegExp(pattern), value]);
            }
            proxyEntry.rewrite = pathRewriter.bind(undefined, pathRewriteEntries);
            delete proxyEntry.pathRewrite;
        }
    }
    return normalizedProxy;
}
function pathRewriter(pathRewriteEntries, path) {
    for (const [pattern, value] of pathRewriteEntries) {
        const updated = path.replace(pattern, value);
        if (path !== updated) {
            return updated;
        }
    }
    return path;
}
/**
 * Calculates the line and column for an error offset in the content of a JSON file.
 * @param location The offset error location from the beginning of the content.
 * @param content The full content of the file containing the error.
 * @returns An object containing the line and column
 */
function getJsonErrorLineColumn(offset, content) {
    if (offset === 0) {
        return { line: 1, column: 1 };
    }
    let line = 0;
    let position = 0;
    // eslint-disable-next-line no-constant-condition
    while (true) {
        ++line;
        const nextNewline = content.indexOf('\n', position);
        if (nextNewline === -1 || nextNewline > offset) {
            break;
        }
        position = nextNewline + 1;
    }
    return { line, column: offset - position + 1 };
}
