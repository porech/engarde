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
exports.LessStylesheetLanguage = void 0;
const promises_1 = require("node:fs/promises");
/**
 * The lazy-loaded instance of the less stylesheet preprocessor.
 * It is only imported and initialized if a less stylesheet is used.
 */
let lessPreprocessor;
function isLessException(error) {
    return !!error && typeof error === 'object' && 'column' in error;
}
exports.LessStylesheetLanguage = Object.freeze({
    name: 'less',
    componentFilter: /^less;/,
    fileFilter: /\.less$/,
    process(data, file, _, options, build) {
        return compileString(data, file, options, build.resolve.bind(build), 
        /* unsafeInlineJavaScript */ false);
    },
});
async function compileString(data, filename, options, resolver, unsafeInlineJavaScript) {
    try {
        lessPreprocessor ??= (await Promise.resolve().then(() => __importStar(require('less')))).default;
    }
    catch {
        return {
            errors: [
                {
                    text: 'Unable to load the "less" stylesheet preprocessor.',
                    location: null,
                    notes: [
                        {
                            text: 'Ensure that the "less" Node.js package is installed within the project. ' +
                                "If not present, installation via the project's package manager should resolve the error.",
                        },
                    ],
                },
            ],
        };
    }
    const less = lessPreprocessor;
    const resolverPlugin = {
        install({ FileManager }, pluginManager) {
            const resolverFileManager = new (class extends FileManager {
                supportsSync() {
                    return false;
                }
                supports() {
                    return true;
                }
                async loadFile(filename, currentDirectory, options, environment) {
                    // Attempt direct loading as a relative path to avoid resolution overhead
                    try {
                        return await super.loadFile(filename, currentDirectory, options, environment);
                    }
                    catch (error) {
                        // Attempt a full resolution if not found
                        const fullResult = await resolver(filename, {
                            kind: 'import-rule',
                            resolveDir: currentDirectory,
                        });
                        if (fullResult.path) {
                            return {
                                filename: fullResult.path,
                                contents: await (0, promises_1.readFile)(fullResult.path, 'utf-8'),
                            };
                        }
                        // Otherwise error by throwing the failing direct result
                        throw error;
                    }
                }
            })();
            pluginManager.addFileManager(resolverFileManager);
        },
    };
    try {
        const { imports, css } = await less.render(data, {
            filename,
            paths: options.includePaths,
            plugins: [resolverPlugin],
            rewriteUrls: 'all',
            javascriptEnabled: unsafeInlineJavaScript,
            sourceMap: options.sourcemap
                ? {
                    sourceMapFileInline: true,
                    outputSourceFiles: true,
                }
                : undefined,
        });
        return {
            contents: css,
            loader: 'css',
            watchFiles: [filename, ...imports],
        };
    }
    catch (error) {
        if (isLessException(error)) {
            const location = convertExceptionLocation(error);
            // Retry with a warning for less files requiring the deprecated inline JavaScript option
            if (error.message.includes('Inline JavaScript is not enabled.')) {
                const withJsResult = await compileString(data, filename, options, resolver, 
                /* unsafeInlineJavaScript */ true);
                withJsResult.warnings = [
                    {
                        text: 'Deprecated inline execution of JavaScript has been enabled ("javascriptEnabled")',
                        location,
                        notes: [
                            {
                                location: null,
                                text: 'JavaScript found within less stylesheets may be executed at build time. [https://lesscss.org/usage/#less-options]',
                            },
                            {
                                location: null,
                                text: 'Support for "javascriptEnabled" may be removed from the Angular CLI starting with Angular v19.',
                            },
                        ],
                    },
                ];
                return withJsResult;
            }
            return {
                errors: [
                    {
                        text: error.message,
                        location,
                    },
                ],
                loader: 'css',
                watchFiles: location.file ? [filename, location.file] : [filename],
            };
        }
        throw error;
    }
}
function convertExceptionLocation(exception) {
    return {
        file: exception.filename,
        line: exception.line,
        column: exception.column,
        // Middle element represents the line containing the exception
        lineText: exception.extract && exception.extract[Math.trunc(exception.extract.length / 2)],
    };
}
