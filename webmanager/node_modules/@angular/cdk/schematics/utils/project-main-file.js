"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProjectMainFile = getProjectMainFile;
const schematics_1 = require("@angular-devkit/schematics");
const project_targets_1 = require("./project-targets");
/** Looks for the main TypeScript file in the given project and returns its path. */
function getProjectMainFile(project) {
    const buildOptions = (0, project_targets_1.getProjectTargetOptions)(project, 'build');
    // `browser` is for the `@angular-devkit/build-angular:application` builder while
    // `main` is for the `@angular-devkit/build-angular:browser` builder.
    const mainPath = (buildOptions['browser'] || buildOptions['main']);
    if (!mainPath) {
        throw new schematics_1.SchematicsException(`Could not find the project main file inside of the ` +
            `workspace config (${project.sourceRoot})`);
    }
    return mainPath;
}
//# sourceMappingURL=project-main-file.js.map