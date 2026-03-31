"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.DevkitMigration = void 0;
const migration_1 = require("../update-tool/migration");
class DevkitMigration extends migration_1.Migration {
    /** Prints an informative message with context on the current target. */
    printInfo(text) {
        const targetName = this.context.isTestTarget ? 'test' : 'build';
        this.logger.info(`- ${this.context.projectName}@${targetName}: ${text}`);
    }
}
exports.DevkitMigration = DevkitMigration;
//# sourceMappingURL=devkit-migration.js.map