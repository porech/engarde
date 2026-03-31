"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
const node_module_1 = require("node:module");
const node_path_1 = require("node:path");
const architect_command_module_1 = require("../../command-builder/architect-command-module");
class ExtractI18nCommandModule extends architect_command_module_1.ArchitectCommandModule {
    multiTarget = false;
    command = 'extract-i18n [project]';
    describe = 'Extracts i18n messages from source code.';
    longDescriptionPath;
    async findDefaultBuilderName(project) {
        // Only application type projects have a default i18n extraction target
        if (project.extensions['projectType'] !== 'application') {
            return;
        }
        const buildTarget = project.targets.get('build');
        if (!buildTarget) {
            // No default if there is no build target
            return;
        }
        // Provide a default based on the defined builder for the 'build' target
        switch (buildTarget.builder) {
            case '@angular-devkit/build-angular:application':
            case '@angular-devkit/build-angular:browser-esbuild':
            case '@angular-devkit/build-angular:browser':
                return '@angular-devkit/build-angular:extract-i18n';
            case '@angular/build:application':
                return '@angular/build:extract-i18n';
        }
        // For other builders, check for `@angular-devkit/build-angular` and use if found.
        // This package is safer to use since it supports both application builder types.
        try {
            const projectRequire = (0, node_module_1.createRequire)((0, node_path_1.join)(this.context.root, project.root) + '/');
            projectRequire.resolve('@angular-devkit/build-angular');
            return '@angular-devkit/build-angular:extract-i18n';
        }
        catch { }
    }
}
exports.default = ExtractI18nCommandModule;
