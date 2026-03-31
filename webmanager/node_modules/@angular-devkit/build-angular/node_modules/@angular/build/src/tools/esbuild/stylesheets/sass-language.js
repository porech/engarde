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
exports.SassStylesheetLanguage = void 0;
exports.shutdownSassWorkerPool = shutdownSassWorkerPool;
const node_path_1 = require("node:path");
const node_url_1 = require("node:url");
const cache_1 = require("../cache");
let sassWorkerPool;
let sassWorkerPoolPromise;
function isSassException(error) {
    return !!error && typeof error === 'object' && 'sassMessage' in error;
}
function shutdownSassWorkerPool() {
    if (sassWorkerPool) {
        void sassWorkerPool.close();
        sassWorkerPool = undefined;
    }
    else if (sassWorkerPoolPromise) {
        void sassWorkerPoolPromise.then(shutdownSassWorkerPool);
    }
    sassWorkerPoolPromise = undefined;
}
exports.SassStylesheetLanguage = Object.freeze({
    name: 'sass',
    componentFilter: /^s[ac]ss;/,
    fileFilter: /\.s[ac]ss$/,
    process(data, file, format, options, build) {
        const syntax = format === 'sass' ? 'indented' : 'scss';
        const resolveUrl = async (url, options) => {
            let resolveDir = build.initialOptions.absWorkingDir;
            if (options.containingUrl) {
                resolveDir = (0, node_path_1.dirname)((0, node_url_1.fileURLToPath)(options.containingUrl));
            }
            const path = url.startsWith('pkg:') ? url.slice(4) : url;
            const result = await build.resolve(path, {
                kind: 'import-rule',
                resolveDir,
            });
            return result;
        };
        return compileString(data, file, syntax, options, resolveUrl);
    },
});
function parsePackageName(url) {
    const parts = (url.startsWith('pkg:') ? url.slice(4) : url).split('/');
    const hasScope = parts.length >= 2 && parts[0][0] === '@';
    const [nameOrScope, nameOrFirstPath, ...pathPart] = parts;
    const packageName = hasScope ? `${nameOrScope}/${nameOrFirstPath}` : nameOrScope;
    return {
        packageName,
        get pathSegments() {
            return !hasScope && nameOrFirstPath ? [nameOrFirstPath, ...pathPart] : pathPart;
        },
    };
}
async function compileString(data, filePath, syntax, options, resolveUrl) {
    // Lazily load Sass when a Sass file is found
    if (sassWorkerPool === undefined) {
        if (sassWorkerPoolPromise === undefined) {
            sassWorkerPoolPromise = Promise.resolve().then(() => __importStar(require('../../sass/sass-service'))).then((sassService) => new sassService.SassWorkerImplementation(true));
        }
        sassWorkerPool = await sassWorkerPoolPromise;
    }
    // Cache is currently local to individual compile requests.
    // Caching follows Sass behavior where a given url will always resolve to the same value
    // regardless of its importer's path.
    // A null value indicates that the cached resolution attempt failed to find a location and
    // later stage resolution should be attempted. This avoids potentially expensive repeat
    // failing resolution attempts.
    const resolutionCache = new cache_1.MemoryCache();
    const packageRootCache = new cache_1.MemoryCache();
    const warnings = [];
    const { silenceDeprecations, futureDeprecations, fatalDeprecations } = options.sass ?? {};
    try {
        const { css, sourceMap, loadedUrls } = await sassWorkerPool.compileStringAsync(data, {
            url: (0, node_url_1.pathToFileURL)(filePath),
            style: 'expanded',
            syntax,
            loadPaths: options.includePaths,
            sourceMap: options.sourcemap,
            sourceMapIncludeSources: options.sourcemap,
            silenceDeprecations,
            fatalDeprecations,
            futureDeprecations,
            quietDeps: true,
            importers: [
                {
                    findFileUrl: (url, options) => resolutionCache.getOrCreate(url, async () => {
                        const result = await resolveUrl(url, options);
                        if (result.path) {
                            return (0, node_url_1.pathToFileURL)(result.path);
                        }
                        // Check for package deep imports
                        const { packageName, pathSegments } = parsePackageName(url);
                        // Caching package root locations is particularly beneficial for `@material/*` packages
                        // which extensively use deep imports.
                        const packageRoot = await packageRootCache.getOrCreate(packageName, async () => {
                            // Use the required presence of a package root `package.json` file to resolve the location
                            const packageResult = await resolveUrl(packageName + '/package.json', options);
                            return packageResult.path ? (0, node_path_1.dirname)(packageResult.path) : null;
                        });
                        // Package not found could be because of an error or the specifier is intended to be found
                        // via a later stage of the resolution process (`loadPaths`, etc.).
                        // Errors are reported after the full completion of the resolution process. Exceptions for
                        // not found packages should not be raised here.
                        if (packageRoot) {
                            return (0, node_url_1.pathToFileURL)((0, node_path_1.join)(packageRoot, ...pathSegments));
                        }
                        // Not found
                        return null;
                    }),
                },
            ],
            logger: {
                warn: (text, { deprecation, stack, span }) => {
                    const notes = [];
                    if (deprecation) {
                        notes.push({ text });
                    }
                    if (stack && !span) {
                        notes.push({ text: stack });
                    }
                    warnings.push({
                        text: deprecation ? 'Deprecation' : text,
                        location: span && {
                            file: span.url && (0, node_url_1.fileURLToPath)(span.url),
                            lineText: span.context,
                            // Sass line numbers are 0-based while esbuild's are 1-based
                            line: span.start.line + 1,
                            column: span.start.column,
                        },
                        notes,
                    });
                },
            },
        });
        return {
            loader: 'css',
            contents: sourceMap ? `${css}\n${sourceMapToUrlComment(sourceMap)}` : css,
            watchFiles: loadedUrls.map((url) => (0, node_url_1.fileURLToPath)(url)),
            warnings,
        };
    }
    catch (error) {
        if (isSassException(error)) {
            const fileWithError = error.span.url ? (0, node_url_1.fileURLToPath)(error.span.url) : undefined;
            const watchFiles = [filePath, ...extractFilesFromStack(error.sassStack)];
            if (fileWithError) {
                watchFiles.push(fileWithError);
            }
            return {
                loader: 'css',
                errors: [
                    {
                        text: error.message,
                    },
                ],
                warnings,
                watchFiles,
            };
        }
        throw error;
    }
}
function sourceMapToUrlComment(sourceMap) {
    const urlSourceMap = Buffer.from(JSON.stringify(sourceMap), 'utf-8').toString('base64');
    return `/*# sourceMappingURL=data:application/json;charset=utf-8;base64,${urlSourceMap} */`;
}
function* extractFilesFromStack(stack) {
    const lines = stack.split('\n');
    const cwd = process.cwd();
    // Stack line has format of "<file> <location> <identifier>"
    for (const line of lines) {
        const segments = line.split(' ');
        if (segments.length < 3) {
            break;
        }
        // Extract path from stack line.
        // Paths may contain spaces. All segments before location are part of the file path.
        let path = '';
        let index = 0;
        while (!segments[index].match(/\d+:\d+/)) {
            path += segments[index++];
        }
        if (path) {
            // Stack paths from dart-sass are relative to the current working directory (not input file or workspace root)
            yield (0, node_path_1.join)(cwd, path);
        }
    }
}
