"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.SymbolRemovalMigration = void 0;
const ts = require("typescript");
const migration_1 = require("../../update-tool/migration");
const upgrade_data_1 = require("../upgrade-data");
/** Migration that flags imports for symbols that have been removed. */
class SymbolRemovalMigration extends migration_1.Migration {
    constructor() {
        super(...arguments);
        /** Change data that upgrades to the specified target version. */
        this.data = (0, upgrade_data_1.getVersionUpgradeData)(this, 'symbolRemoval');
        // Only enable the migration rule if there is upgrade data.
        this.enabled = this.data.length !== 0;
    }
    visitNode(node) {
        if (!ts.isImportDeclaration(node) || !ts.isStringLiteral(node.moduleSpecifier)) {
            return;
        }
        const namedBindings = node.importClause && node.importClause.namedBindings;
        if (!namedBindings || !ts.isNamedImports(namedBindings)) {
            return;
        }
        const moduleNameMatches = this.data.filter(entry => node.moduleSpecifier.text === entry.module);
        if (!moduleNameMatches.length) {
            return;
        }
        namedBindings.elements.forEach(element => {
            var _a;
            const elementName = ((_a = element.propertyName) === null || _a === void 0 ? void 0 : _a.text) || element.name.text;
            moduleNameMatches.forEach(match => {
                if (match.name === elementName) {
                    this.createFailureAtNode(element, match.message);
                }
            });
        });
    }
}
exports.SymbolRemovalMigration = SymbolRemovalMigration;
//# sourceMappingURL=symbol-removal.js.map