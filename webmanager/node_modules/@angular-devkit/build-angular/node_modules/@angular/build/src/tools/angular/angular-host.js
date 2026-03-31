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
exports.ensureSourceFileVersions = ensureSourceFileVersions;
exports.createAngularCompilerHost = createAngularCompilerHost;
const node_assert_1 = __importDefault(require("node:assert"));
const node_crypto_1 = require("node:crypto");
const node_path_1 = __importDefault(require("node:path"));
/**
 * Patches in-place the `getSourceFiles` function on an instance of a TypeScript
 * `Program` to ensure that all returned SourceFile instances have a `version`
 * field. The `version` field is required when used with a TypeScript BuilderProgram.
 * @param program The TypeScript Program instance to patch.
 */
function ensureSourceFileVersions(program) {
    const baseGetSourceFiles = program.getSourceFiles;
    // TODO: Update Angular compiler to add versions to all internal files and remove this
    program.getSourceFiles = function (...parameters) {
        const files = baseGetSourceFiles(...parameters);
        for (const file of files) {
            if (file.version === undefined) {
                file.version = (0, node_crypto_1.createHash)('sha256').update(file.text).digest('hex');
            }
        }
        return files;
    };
}
function augmentHostWithCaching(host, cache) {
    const baseGetSourceFile = host.getSourceFile;
    host.getSourceFile = function (fileName, languageVersion, onError, shouldCreateNewSourceFile, ...parameters) {
        if (!shouldCreateNewSourceFile && cache.has(fileName)) {
            return cache.get(fileName);
        }
        const file = baseGetSourceFile.call(host, fileName, languageVersion, onError, true, ...parameters);
        if (file) {
            cache.set(fileName, file);
        }
        return file;
    };
}
function augmentResolveModuleNames(typescript, host, resolvedModuleModifier, moduleResolutionCache) {
    if (host.resolveModuleNames) {
        const baseResolveModuleNames = host.resolveModuleNames;
        host.resolveModuleNames = function (moduleNames, ...parameters) {
            return moduleNames.map((name) => {
                const result = baseResolveModuleNames.call(host, [name], ...parameters);
                return resolvedModuleModifier(result[0], name);
            });
        };
    }
    else {
        host.resolveModuleNames = function (moduleNames, containingFile, _reusedNames, redirectedReference, options) {
            return moduleNames.map((name) => {
                const result = typescript.resolveModuleName(name, containingFile, options, host, moduleResolutionCache, redirectedReference).resolvedModule;
                return resolvedModuleModifier(result, name);
            });
        };
    }
}
function normalizePath(path) {
    return node_path_1.default.win32.normalize(path).replace(/\\/g, node_path_1.default.posix.sep);
}
function augmentHostWithReplacements(typescript, host, replacements, moduleResolutionCache) {
    if (Object.keys(replacements).length === 0) {
        return;
    }
    const normalizedReplacements = {};
    for (const [key, value] of Object.entries(replacements)) {
        normalizedReplacements[normalizePath(key)] = normalizePath(value);
    }
    const tryReplace = (resolvedModule) => {
        const replacement = resolvedModule && normalizedReplacements[resolvedModule.resolvedFileName];
        if (replacement) {
            return {
                resolvedFileName: replacement,
                isExternalLibraryImport: /[/\\]node_modules[/\\]/.test(replacement),
            };
        }
        else {
            return resolvedModule;
        }
    };
    augmentResolveModuleNames(typescript, host, tryReplace, moduleResolutionCache);
}
function createAngularCompilerHost(typescript, compilerOptions, hostOptions, packageJsonCache) {
    // Create TypeScript compiler host
    const host = typescript.createIncrementalCompilerHost(compilerOptions);
    // Set the parsing mode to the same as TS 5.3+ default for tsc. This provides a parse
    // performance improvement by skipping non-type related JSDoc parsing.
    host.jsDocParsingMode = typescript.JSDocParsingMode.ParseForTypeErrors;
    // The AOT compiler currently requires this hook to allow for a transformResource hook.
    // Once the AOT compiler allows only a transformResource hook, this can be reevaluated.
    host.readResource = async function (filename) {
        return this.readFile(filename) ?? '';
    };
    // Add an AOT compiler resource transform hook
    host.transformResource = async function (data, context) {
        // Only style resources are transformed currently
        if (context.type !== 'style') {
            return null;
        }
        (0, node_assert_1.default)(!context.resourceFile || !hostOptions.externalStylesheets?.has(context.resourceFile), 'External runtime stylesheets should not be transformed: ' + context.resourceFile);
        // No transformation required if the resource is empty
        if (data.trim().length === 0) {
            return { content: '' };
        }
        const result = await hostOptions.transformStylesheet(data, context.containingFile, context.resourceFile ?? undefined, context.order, context.className);
        return typeof result === 'string' ? { content: result } : null;
    };
    host.resourceNameToFileName = function (resourceName, containingFile) {
        const resolvedPath = node_path_1.default.join(node_path_1.default.dirname(containingFile), resourceName);
        if (!this.fileExists(resolvedPath)) {
            return null;
        }
        // All resource names that have template file extensions are assumed to be templates
        // TODO: Update compiler to provide the resource type to avoid extension matching here.
        if (!hostOptions.externalStylesheets || hasTemplateExtension(resolvedPath)) {
            return resolvedPath;
        }
        // For external stylesheets, create a unique identifier and store the mapping
        let externalId = hostOptions.externalStylesheets.get(resolvedPath);
        if (externalId === undefined) {
            externalId = (0, node_crypto_1.createHash)('sha256').update(resolvedPath).digest('hex');
            hostOptions.externalStylesheets.set(resolvedPath, externalId);
        }
        return externalId + '.css';
    };
    // Allow the AOT compiler to request the set of changed templates and styles
    host.getModifiedResourceFiles = function () {
        return hostOptions.modifiedFiles;
    };
    // Provide a resolution cache to ensure package.json lookups are cached
    const resolutionCache = typescript.createModuleResolutionCache(host.getCurrentDirectory(), host.getCanonicalFileName.bind(host), compilerOptions, packageJsonCache);
    host.getModuleResolutionCache = () => resolutionCache;
    // Augment TypeScript Host for file replacements option
    if (hostOptions.fileReplacements) {
        augmentHostWithReplacements(typescript, host, hostOptions.fileReplacements, resolutionCache);
    }
    // Augment TypeScript Host with source file caching if provided
    if (hostOptions.sourceFileCache) {
        augmentHostWithCaching(host, hostOptions.sourceFileCache);
    }
    return host;
}
function hasTemplateExtension(file) {
    const extension = node_path_1.default.extname(file).toLowerCase();
    switch (extension) {
        case '.htm':
        case '.html':
        case '.svg':
            return true;
    }
    return false;
}
