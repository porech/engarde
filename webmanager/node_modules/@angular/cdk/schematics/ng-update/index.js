"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateToV20 = updateToV20;
const target_version_1 = require("../update-tool/target-version");
const upgrade_data_1 = require("./upgrade-data");
const devkit_migration_rule_1 = require("./devkit-migration-rule");
const cdkMigrations = [];
/** Entry point for the migration schematics with target of Angular CDK 20.0.0 */
function updateToV20() {
    return (0, devkit_migration_rule_1.createMigrationSchematicRule)(target_version_1.TargetVersion.V20, cdkMigrations, upgrade_data_1.cdkUpgradeData, onMigrationComplete);
}
/** Function that will be called when the migration completed. */
function onMigrationComplete(context, targetVersion, hasFailures) {
    context.logger.info('');
    context.logger.info(`  ✓  Updated Angular CDK to ${targetVersion}`);
    context.logger.info('');
    if (hasFailures) {
        context.logger.warn('  ⚠  Some issues were detected but could not be fixed automatically. Please check the ' +
            'output above and fix these issues manually.');
    }
}
//# sourceMappingURL=index.js.map