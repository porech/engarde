"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateFromFiles = generateFromFiles;
const schematics_1 = require("@angular-devkit/schematics");
const parse_name_1 = require("./parse-name");
const validation_1 = require("./validation");
const workspace_1 = require("./workspace");
function generateFromFiles(options, extraTemplateValues = {}) {
    return async (host) => {
        options.path ??= await (0, workspace_1.createDefaultPath)(host, options.project);
        options.prefix ??= '';
        options.flat ??= true;
        // Schematic templates require a defined type value
        options.type ??= '';
        const parsedPath = (0, parse_name_1.parseName)(options.path, options.name);
        options.name = parsedPath.name;
        options.path = parsedPath.path;
        (0, validation_1.validateClassName)(schematics_1.strings.classify(options.name));
        const templateFilesDirectory = options.templateFilesDirectory ?? './files';
        const templateSource = (0, schematics_1.apply)((0, schematics_1.url)(templateFilesDirectory), [
            options.skipTests ? (0, schematics_1.filter)((path) => !path.endsWith('.spec.ts.template')) : (0, schematics_1.noop)(),
            (0, schematics_1.applyTemplates)({
                ...schematics_1.strings,
                ...options,
                ...extraTemplateValues,
            }),
            !options.type
                ? (0, schematics_1.forEach)((file) => {
                    let filePath = file.path;
                    while (filePath.includes('..')) {
                        filePath = filePath.replaceAll('..', '.');
                    }
                    return {
                        content: file.content,
                        path: filePath,
                    };
                })
                : (0, schematics_1.noop)(),
            (0, schematics_1.move)(parsedPath.path + (options.flat ? '' : '/' + schematics_1.strings.dasherize(options.name))),
        ]);
        return (0, schematics_1.chain)([(0, schematics_1.mergeWith)(templateSource)]);
    };
}
