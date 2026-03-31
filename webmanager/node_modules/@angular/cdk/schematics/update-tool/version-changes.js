"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getChangesForTarget = getChangesForTarget;
exports.getAllChanges = getAllChanges;
const target_version_1 = require("./target-version");
/**
 * Gets the changes for a given target version from the specified version changes object.
 *
 * For readability and a good overview of breaking changes, the version change data always
 * includes the related Pull Request link. Since this data is not needed when performing the
 * upgrade, this unused data can be removed and the changes data can be flattened into an
 * easy iterable array.
 */
function getChangesForTarget(target, data) {
    if (!data) {
        const version = target_version_1.TargetVersion[target];
        throw new Error(`No data could be found for target version: ${version}`);
    }
    return (data[target] || []).reduce((result, prData) => result.concat(prData.changes), []);
}
/**
 * Gets all changes from the specified version changes object. This is helpful in case a migration
 * rule does not distinguish data based on the target version, but for readability the
 * upgrade data is separated for each target version.
 */
function getAllChanges(data) {
    return Object.keys(data)
        .map(targetVersion => getChangesForTarget(targetVersion, data))
        .reduce((result, versionData) => result.concat(versionData), []);
}
//# sourceMappingURL=version-changes.js.map