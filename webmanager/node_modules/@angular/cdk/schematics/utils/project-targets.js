"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProjectTargetOptions = getProjectTargetOptions;
exports.getProjectBuildTargets = getProjectBuildTargets;
exports.getProjectTestTargets = getProjectTestTargets;
const schematics_1 = require("@angular-devkit/schematics");
/** Possible names of CLI builders used to configure the project. */
const PROJECT_BUILDERS = new Set([
    '@angular-devkit/build-angular:browser-esbuild',
    '@angular-devkit/build-angular:application',
    '@angular-devkit/build-angular:browser',
    '@angular/build:application',
]);
/** Possible name of CLI builders used to run tests in the project. */
const TEST_BUILDERS = new Set(['@angular-devkit/build-angular:karma', '@angular/build:karma']);
/** Resolves the architect options for the build target of the given project. */
function getProjectTargetOptions(project, buildTarget) {
    var _a, _b;
    const options = (_b = (_a = project.targets) === null || _a === void 0 ? void 0 : _a.get(buildTarget)) === null || _b === void 0 ? void 0 : _b.options;
    if (!options) {
        throw new schematics_1.SchematicsException(`Cannot determine project target configuration for: ${buildTarget}.`);
    }
    return options;
}
/** Gets all of the default CLI-provided build targets in a project. */
function getProjectBuildTargets(project) {
    return getTargetsByBuilderName(project, builder => !!builder && PROJECT_BUILDERS.has(builder));
}
/** Gets all of the default CLI-provided testing targets in a project. */
function getProjectTestTargets(project) {
    return getTargetsByBuilderName(project, builder => !!builder && TEST_BUILDERS.has(builder));
}
/** Gets all targets from the given project that pass a predicate check. */
function getTargetsByBuilderName(project, predicate) {
    return Array.from(project.targets.keys())
        .filter(name => { var _a; return predicate((_a = project.targets.get(name)) === null || _a === void 0 ? void 0 : _a.builder); })
        .map(name => project.targets.get(name));
}
//# sourceMappingURL=project-targets.js.map