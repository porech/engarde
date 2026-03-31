"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
const workspace_1 = require("../../utility/workspace");
const TYPE_SCHEMATICS = ['component', 'directive', 'service'];
const SEPARATOR_SCHEMATICS = ['guard', 'interceptor', 'module', 'pipe', 'resolver'];
function default_1() {
    return (0, workspace_1.updateWorkspace)((workspace) => {
        let schematicsDefaults = workspace.extensions['schematics'];
        // Ensure "schematics" field is an object
        if (!schematicsDefaults ||
            typeof schematicsDefaults !== 'object' ||
            Array.isArray(schematicsDefaults)) {
            schematicsDefaults = workspace.extensions['schematics'] = {};
        }
        // Add "type" value for each schematic to continue generating a type suffix.
        // New default is an empty type value.
        for (const schematicName of TYPE_SCHEMATICS) {
            const schematic = (schematicsDefaults[`@schematics/angular:${schematicName}`] ??= {});
            if (typeof schematic === 'object' && !Array.isArray(schematic) && !('type' in schematic)) {
                schematic['type'] = schematicName;
            }
        }
        // Add "typeSeparator" value for each schematic to continue generating "." before type.
        // New default is an "-" type value.
        for (const schematicName of SEPARATOR_SCHEMATICS) {
            const schematic = (schematicsDefaults[`@schematics/angular:${schematicName}`] ??= {});
            if (typeof schematic === 'object' &&
                !Array.isArray(schematic) &&
                !('typeSeparator' in schematic)) {
                schematic['typeSeparator'] = '.';
            }
        }
    });
}
