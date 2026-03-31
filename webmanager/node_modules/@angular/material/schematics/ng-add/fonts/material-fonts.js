"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.addFontsToIndex = addFontsToIndex;
const schematics_1 = require("@angular-devkit/schematics");
const schematics_2 = require("@angular/cdk/schematics");
const utility_1 = require("@schematics/angular/utility");
/** Adds the Material Design fonts to the index HTML file. */
function addFontsToIndex(options) {
    return async (host) => {
        const workspace = await (0, utility_1.readWorkspace)(host);
        const project = (0, schematics_2.getProjectFromWorkspace)(workspace, options.project);
        const projectIndexFiles = (0, schematics_2.getProjectIndexFiles)(project);
        if (!projectIndexFiles.length) {
            throw new schematics_1.SchematicsException('No project index HTML file could be found.');
        }
        const fonts = [
            'https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500&display=swap',
            'https://fonts.googleapis.com/icon?family=Material+Icons',
        ];
        projectIndexFiles.forEach(indexFilePath => {
            fonts.forEach(font => {
                (0, schematics_2.appendHtmlElementToHead)(host, indexFilePath, `<link href="${font}" rel="stylesheet">`);
            });
        });
    };
}
//# sourceMappingURL=material-fonts.js.map