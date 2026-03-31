"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ROUTING_MODULE_EXT_LEGACY = exports.MODULE_EXT_LEGACY = exports.ROUTING_MODULE_EXT = exports.MODULE_EXT = void 0;
exports.findModuleFromOptions = findModuleFromOptions;
exports.findModule = findModule;
exports.buildRelativePath = buildRelativePath;
const core_1 = require("@angular-devkit/core");
exports.MODULE_EXT = '-module.ts';
exports.ROUTING_MODULE_EXT = '-routing-module.ts';
exports.MODULE_EXT_LEGACY = '.module.ts';
exports.ROUTING_MODULE_EXT_LEGACY = '-routing.module.ts';
/**
 * Find the module referred by a set of options passed to the schematics.
 */
function findModuleFromOptions(host, options) {
    if (options.standalone || options.skipImport) {
        return undefined;
    }
    if (!options.module) {
        const pathToCheck = (options.path || '') + '/' + options.name;
        return (0, core_1.normalize)(findModule(host, pathToCheck, options.moduleExt, options.routingModuleExt));
    }
    else {
        const modulePath = (0, core_1.normalize)(`/${options.path}/${options.module}`);
        const componentPath = (0, core_1.normalize)(`/${options.path}/${options.name}`);
        const moduleBaseName = (0, core_1.normalize)(modulePath).split('/').pop();
        const candidateSet = new Set([(0, core_1.normalize)(options.path || '/')]);
        for (let dir = modulePath; dir != core_1.NormalizedRoot; dir = (0, core_1.dirname)(dir)) {
            candidateSet.add(dir);
        }
        for (let dir = componentPath; dir != core_1.NormalizedRoot; dir = (0, core_1.dirname)(dir)) {
            candidateSet.add(dir);
        }
        const candidatesDirs = [...candidateSet].sort((a, b) => b.length - a.length);
        const candidateFiles = ['', `${moduleBaseName}.ts`];
        if (options.moduleExt) {
            candidateFiles.push(`${moduleBaseName}${options.moduleExt}`);
        }
        else {
            candidateFiles.push(`${moduleBaseName}${exports.MODULE_EXT}`, `${moduleBaseName}${exports.MODULE_EXT_LEGACY}`);
        }
        for (const c of candidatesDirs) {
            for (const sc of candidateFiles) {
                const scPath = (0, core_1.join)(c, sc);
                if (host.exists(scPath) && host.readText(scPath).includes('@NgModule')) {
                    return (0, core_1.normalize)(scPath);
                }
            }
        }
        throw new Error(`Specified module '${options.module}' does not exist.\n` +
            `Looked in the following directories:\n    ${candidatesDirs.join('\n    ')}`);
    }
}
/**
 * Function to find the "closest" module to a generated file's path.
 */
function findModule(host, generateDir, moduleExt, routingModuleExt) {
    let dir = host.getDir('/' + generateDir);
    let foundRoutingModule = false;
    const moduleExtensions = moduleExt ? [moduleExt] : [exports.MODULE_EXT, exports.MODULE_EXT_LEGACY];
    const routingModuleExtensions = routingModuleExt
        ? [routingModuleExt]
        : [exports.ROUTING_MODULE_EXT, exports.ROUTING_MODULE_EXT_LEGACY];
    while (dir) {
        const allMatches = dir.subfiles.filter((p) => moduleExtensions.some((m) => p.endsWith(m)));
        const filteredMatches = allMatches.filter((p) => !routingModuleExtensions.some((m) => p.endsWith(m)));
        foundRoutingModule = foundRoutingModule || allMatches.length !== filteredMatches.length;
        if (filteredMatches.length == 1) {
            return (0, core_1.join)(dir.path, filteredMatches[0]);
        }
        else if (filteredMatches.length > 1) {
            throw new Error(`More than one module matches. Use the '--skip-import' option to skip importing ` +
                'the component into the closest module or use the module option to specify a module.');
        }
        dir = dir.parent;
    }
    const errorMsg = foundRoutingModule
        ? 'Could not find a non Routing NgModule.' +
            `\nModules with suffix '${routingModuleExt}' are strictly reserved for routing.` +
            `\nUse the '--skip-import' option to skip importing in NgModule.`
        : `Could not find an NgModule. Use the '--skip-import' option to skip importing in NgModule.`;
    throw new Error(errorMsg);
}
/**
 * Build a relative path from one file path to another file path.
 */
function buildRelativePath(from, to) {
    from = (0, core_1.normalize)(from);
    to = (0, core_1.normalize)(to);
    // Convert to arrays.
    const fromParts = from.split('/');
    const toParts = to.split('/');
    // Remove file names (preserving destination)
    fromParts.pop();
    const toFileName = toParts.pop();
    const relativePath = (0, core_1.relative)((0, core_1.normalize)(fromParts.join('/') || '/'), (0, core_1.normalize)(toParts.join('/') || '/'));
    let pathPrefix = '';
    // Set the path prefix for same dir or child dir, parent dir starts with `..`
    if (!relativePath) {
        pathPrefix = '.';
    }
    else if (!relativePath.startsWith('.')) {
        pathPrefix = `./`;
    }
    if (pathPrefix && !pathPrefix.endsWith('/')) {
        pathPrefix += '/';
    }
    return pathPrefix + (relativePath ? relativePath + '/' : '') + toFileName;
}
