"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.targetBuildNotFoundError = targetBuildNotFoundError;
exports.isUsingApplicationBuilder = isUsingApplicationBuilder;
const schematics_1 = require("@angular-devkit/schematics");
const workspace_models_1 = require("./workspace-models");
function targetBuildNotFoundError() {
    return new schematics_1.SchematicsException(`Project target "build" not found.`);
}
function isUsingApplicationBuilder(project) {
    const buildBuilder = project.targets.get('build')?.builder;
    const isUsingApplicationBuilder = buildBuilder === workspace_models_1.Builders.Application || buildBuilder === workspace_models_1.Builders.BuildApplication;
    return isUsingApplicationBuilder;
}
