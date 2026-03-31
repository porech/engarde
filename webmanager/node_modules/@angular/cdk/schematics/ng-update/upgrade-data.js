"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.cdkUpgradeData = void 0;
exports.getVersionUpgradeData = getVersionUpgradeData;
const version_changes_1 = require("../update-tool/version-changes");
const data_1 = require("./data");
/** Upgrade data for the Angular CDK. */
exports.cdkUpgradeData = {
    attributeSelectors: data_1.attributeSelectors,
    classNames: data_1.classNames,
    constructorChecks: data_1.constructorChecks,
    cssSelectors: data_1.cssSelectors,
    cssTokens: data_1.cssTokens,
    elementSelectors: data_1.elementSelectors,
    inputNames: data_1.inputNames,
    methodCallChecks: data_1.methodCallChecks,
    outputNames: data_1.outputNames,
    propertyNames: data_1.propertyNames,
    symbolRemoval: data_1.symbolRemoval,
};
/**
 * Gets the reduced upgrade data for the specified data key. The function reads out the
 * target version and upgrade data object from the migration and resolves the specified
 * data portion that is specifically tied to the target version.
 */
function getVersionUpgradeData(migration, dataName) {
    if (migration.targetVersion === null) {
        return [];
    }
    // Note that below we need to cast to `unknown` first TS doesn't infer the type of T correctly.
    return (0, version_changes_1.getChangesForTarget)(migration.targetVersion, migration.upgradeData[dataName]);
}
//# sourceMappingURL=upgrade-data.js.map