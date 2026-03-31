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
const schematics_1 = require("@angular-devkit/schematics");
const schematics_2 = require("@angular/cdk/schematics");
/**
 * Scaffolds a new table component.
 * Internally it bootstraps the base component schematic
 */
function default_1(options) {
    return (0, schematics_1.chain)([
        (0, schematics_2.buildComponent)({ ...options }, {
            template: './__path__/__name@dasherize@if-flat__/__name@dasherize__.component.html.template',
            stylesheet: './__path__/__name@dasherize@if-flat__/__name@dasherize__.component.__style__.template',
        }),
        options.skipImport ? (0, schematics_1.noop)() : addFormModulesToModule(options),
    ]);
}
/**
 * Adds the required modules to the relative module.
 */
function addFormModulesToModule(options) {
    return async (host) => {
        const isStandalone = await (0, schematics_2.isStandaloneSchematic)(host, options);
        if (!isStandalone) {
            const modulePath = (await (0, schematics_2.findModuleFromOptions)(host, options));
            (0, schematics_2.addModuleImportToModule)(host, modulePath, 'MatInputModule', '@angular/material/input');
            (0, schematics_2.addModuleImportToModule)(host, modulePath, 'MatButtonModule', '@angular/material/button');
            (0, schematics_2.addModuleImportToModule)(host, modulePath, 'MatSelectModule', '@angular/material/select');
            (0, schematics_2.addModuleImportToModule)(host, modulePath, 'MatRadioModule', '@angular/material/radio');
            (0, schematics_2.addModuleImportToModule)(host, modulePath, 'MatCardModule', '@angular/material/card');
            (0, schematics_2.addModuleImportToModule)(host, modulePath, 'ReactiveFormsModule', '@angular/forms');
        }
    };
}
//# sourceMappingURL=index.js.map