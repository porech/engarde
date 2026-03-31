"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProjectFromWorkspace = getProjectFromWorkspace;
const schematics_1 = require("@angular-devkit/schematics");
/**
 * Finds the specified project configuration in the workspace. Throws an error if the project
 * couldn't be found.
 */
function getProjectFromWorkspace(workspace, projectName) {
    if (!projectName) {
        // TODO(crisbeto): some schematics APIs have the project name as optional so for now it's
        // simpler to allow undefined and checking it at runtime. Eventually we should clean this up.
        throw new schematics_1.SchematicsException('Project name is required.');
    }
    const project = workspace.projects.get(projectName);
    if (!project) {
        throw new schematics_1.SchematicsException(`Could not find project in workspace: ${projectName}`);
    }
    return project;
}
//# sourceMappingURL=get-project.js.map