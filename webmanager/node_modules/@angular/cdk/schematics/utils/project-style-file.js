"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProjectStyleFile = getProjectStyleFile;
const core_1 = require("@angular-devkit/core");
const project_targets_1 = require("./project-targets");
/** Regular expression that matches all possible Angular CLI default style files. */
const defaultStyleFileRegex = /styles\.(c|le|sc)ss/;
/** Regular expression that matches all files that have a proper stylesheet extension. */
const validStyleFileRegex = /\.(c|le|sc)ss/;
/**
 * Gets a style file with the given extension in a project and returns its path. If no
 * extension is specified, any style file with a valid extension will be returned.
 */
function getProjectStyleFile(project, extension) {
    const buildOptions = (0, project_targets_1.getProjectTargetOptions)(project, 'build');
    const buildStyles = buildOptions['styles'];
    if (buildStyles && (0, core_1.isJsonArray)(buildStyles) && buildStyles.length) {
        const styles = buildStyles.map(s => (typeof s === 'string' ? s : s.input));
        // Look for the default style file that is generated for new projects by the Angular CLI. This
        // default style file is usually called `styles.ext` unless it has been changed explicitly.
        const defaultMainStylePath = styles.find(file => extension ? file === `styles.${extension}` : defaultStyleFileRegex.test(file));
        if (defaultMainStylePath) {
            return (0, core_1.normalize)(defaultMainStylePath);
        }
        // If no default style file could be found, use the first style file that matches the given
        // extension. If no extension specified explicitly, we look for any file with a valid style
        // file extension.
        const fallbackStylePath = styles.find(file => extension ? file.endsWith(`.${extension}`) : validStyleFileRegex.test(file));
        if (fallbackStylePath) {
            return (0, core_1.normalize)(fallbackStylePath);
        }
    }
    return null;
}
//# sourceMappingURL=project-style-file.js.map