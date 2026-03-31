"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.findTests = findTests;
exports.getTestEntrypoints = getTestEntrypoints;
const node_fs_1 = require("node:fs");
const node_path_1 = require("node:path");
const tinyglobby_1 = require("tinyglobby");
const path_1 = require("../../utils/path");
/* Go through all patterns and find unique list of files */
async function findTests(include, exclude, workspaceRoot, projectSourceRoot) {
    const matchingTestsPromises = include.map((pattern) => findMatchingTests(pattern, exclude, workspaceRoot, projectSourceRoot));
    const files = await Promise.all(matchingTestsPromises);
    // Unique file names
    return [...new Set(files.flat())];
}
/** Generate unique bundle names for a set of test files. */
function getTestEntrypoints(testFiles, { projectSourceRoot, workspaceRoot }) {
    const seen = new Set();
    return new Map(Array.from(testFiles, (testFile) => {
        const relativePath = removeRoots(testFile, [projectSourceRoot, workspaceRoot])
            // Strip leading dots and path separators.
            .replace(/^[./\\]+/, '')
            // Replace any path separators with dashes.
            .replace(/[/\\]/g, '-');
        const baseName = `spec-${(0, node_path_1.basename)(relativePath, (0, node_path_1.extname)(relativePath))}`;
        let uniqueName = baseName;
        let suffix = 2;
        while (seen.has(uniqueName)) {
            uniqueName = `${baseName}-${suffix}`.replace(/([^\w](?:spec|test))-([\d]+)$/, '-$2$1');
            ++suffix;
        }
        seen.add(uniqueName);
        return [uniqueName, testFile];
    }));
}
const removeLeadingSlash = (pattern) => {
    if (pattern.charAt(0) === '/') {
        return pattern.substring(1);
    }
    return pattern;
};
const removeRelativeRoot = (path, root) => {
    if (path.startsWith(root)) {
        return path.substring(root.length);
    }
    return path;
};
function removeRoots(path, roots) {
    for (const root of roots) {
        if (path.startsWith(root)) {
            return path.substring(root.length);
        }
    }
    return (0, node_path_1.basename)(path);
}
async function findMatchingTests(pattern, ignore, workspaceRoot, projectSourceRoot) {
    // normalize pattern, glob lib only accepts forward slashes
    let normalizedPattern = (0, path_1.toPosixPath)(pattern);
    normalizedPattern = removeLeadingSlash(normalizedPattern);
    const relativeProjectRoot = (0, path_1.toPosixPath)((0, node_path_1.relative)(workspaceRoot, projectSourceRoot) + '/');
    // remove relativeProjectRoot to support relative paths from root
    // such paths are easy to get when running scripts via IDEs
    normalizedPattern = removeRelativeRoot(normalizedPattern, relativeProjectRoot);
    // special logic when pattern does not look like a glob
    if (!(0, tinyglobby_1.isDynamicPattern)(normalizedPattern)) {
        if (await isDirectory((0, node_path_1.join)(projectSourceRoot, normalizedPattern))) {
            normalizedPattern = `${normalizedPattern}/**/*.spec.@(ts|tsx)`;
        }
        else {
            // see if matching spec file exists
            const fileExt = (0, node_path_1.extname)(normalizedPattern);
            // Replace extension to `.spec.ext`. Example: `src/app/app.component.ts`-> `src/app/app.component.spec.ts`
            const potentialSpec = (0, node_path_1.join)(projectSourceRoot, (0, node_path_1.dirname)(normalizedPattern), `${(0, node_path_1.basename)(normalizedPattern, fileExt)}.spec${fileExt}`);
            if (await exists(potentialSpec)) {
                return [potentialSpec];
            }
        }
    }
    // normalize the patterns in the ignore list
    const normalizedIgnorePatternList = ignore.map((pattern) => removeRelativeRoot(removeLeadingSlash((0, path_1.toPosixPath)(pattern)), relativeProjectRoot));
    return (0, tinyglobby_1.glob)(normalizedPattern, {
        cwd: projectSourceRoot,
        absolute: true,
        ignore: ['**/node_modules/**', ...normalizedIgnorePatternList],
    });
}
async function isDirectory(path) {
    try {
        const stats = await node_fs_1.promises.stat(path);
        return stats.isDirectory();
    }
    catch {
        return false;
    }
}
async function exists(path) {
    try {
        await node_fs_1.promises.access(path, node_fs_1.constants.F_OK);
        return true;
    }
    catch {
        return false;
    }
}
