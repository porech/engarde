"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.MiscTemplateMigration = void 0;
const migration_1 = require("../../update-tool/migration");
/**
 * Migration that walks through every template and reports if there are
 * instances of outdated Angular CDK API that can't be migrated automatically.
 */
class MiscTemplateMigration extends migration_1.Migration {
    constructor() {
        super(...arguments);
        // There are currently no migrations for V19 deprecations.
        this.enabled = false;
    }
    visitTemplate(template) { }
}
exports.MiscTemplateMigration = MiscTemplateMigration;
//# sourceMappingURL=misc-template.js.map