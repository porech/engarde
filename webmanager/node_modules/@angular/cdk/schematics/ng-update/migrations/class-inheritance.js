"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClassInheritanceMigration = void 0;
const ts = require("typescript");
const migration_1 = require("../../update-tool/migration");
const base_types_1 = require("../typescript/base-types");
const upgrade_data_1 = require("../upgrade-data");
/**
 * Migration that identifies class declarations that extend CDK or Material classes
 * which had a public property change.
 */
class ClassInheritanceMigration extends migration_1.Migration {
    constructor() {
        super(...arguments);
        /**
         * Map of classes that have been updated. Each class name maps to the according property
         * change data.
         */
        this.propertyNames = new Map();
        // Only enable the migration rule if there is upgrade data.
        this.enabled = this.propertyNames.size !== 0;
    }
    init() {
        (0, upgrade_data_1.getVersionUpgradeData)(this, 'propertyNames')
            .filter(data => data.limitedTo && data.limitedTo.classes)
            .forEach(data => data.limitedTo.classes.forEach(name => this.propertyNames.set(name, data)));
    }
    visitNode(node) {
        if (ts.isClassDeclaration(node)) {
            this._visitClassDeclaration(node);
        }
    }
    _visitClassDeclaration(node) {
        const baseTypes = (0, base_types_1.determineBaseTypes)(node);
        const className = node.name ? node.name.text : '{unknown-name}';
        if (!baseTypes) {
            return;
        }
        baseTypes.forEach(typeName => {
            const data = this.propertyNames.get(typeName);
            if (data) {
                this.createFailureAtNode(node, `Found class "${className}" which extends class ` +
                    `"${typeName}". Please note that the base class property ` +
                    `"${data.replace}" has changed to "${data.replaceWith}". ` +
                    `You may need to update your class as well.`);
            }
        });
    }
}
exports.ClassInheritanceMigration = ClassInheritanceMigration;
//# sourceMappingURL=class-inheritance.js.map