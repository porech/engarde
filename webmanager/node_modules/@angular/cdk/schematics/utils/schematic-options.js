"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDefaultComponentOptions = getDefaultComponentOptions;
exports.isStandaloneSchematic = isStandaloneSchematic;
const core_1 = require("@angular-devkit/core");
const schema_1 = require("@schematics/angular/component/schema");
const ng_ast_utils_1 = require("@schematics/angular/utility/ng-ast-utils");
const project_main_file_1 = require("./project-main-file");
const utility_1 = require("@schematics/angular/utility");
const get_project_1 = require("./get-project");
/**
 * Returns the default options for the `@schematics/angular:component` schematic which would
 * have been specified at project initialization (ng new or ng init).
 *
 * This is necessary because the Angular CLI only exposes the default values for the "--style",
 * "--inlineStyle", "--skipTests" and "--inlineTemplate" options to the "component" schematic.
 */
function getDefaultComponentOptions(project) {
    // Note: Not all options which are available when running "ng new" will be stored in the
    // workspace config. List of options which will be available in the configuration:
    // angular/angular-cli/blob/main/packages/schematics/angular/application/index.ts#L109-L131
    let skipTests = getDefaultComponentOption(project, ['skipTests'], null);
    // In case "skipTests" is not set explicitly, also look for the "spec" option. The "spec"
    // option has been deprecated but can be still used in older Angular CLI projects.
    // See: https://github.com/angular/angular-cli/commit/a12a4e02a4689b5bdbc6e740c0d9865afb55671a
    if (skipTests === null) {
        skipTests = !getDefaultComponentOption(project, ['spec'], true);
    }
    return {
        style: getDefaultComponentOption(project, ['style', 'styleext'], schema_1.Style.Css),
        inlineStyle: getDefaultComponentOption(project, ['inlineStyle'], false),
        inlineTemplate: getDefaultComponentOption(project, ['inlineTemplate'], false),
        skipTests: skipTests,
    };
}
/** Determines whether the schematic is configured to be standalone. */
function isStandaloneSchematic(host, options) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        if (options.standalone != null) {
            return options.standalone;
        }
        // If the `--standalone` flag isn't passed and there isn't a default, infer based on the project.
        const workspace = yield (0, utility_1.readWorkspace)(host);
        const project = (0, get_project_1.getProjectFromWorkspace)(workspace, options.project);
        // Legacy projects might not have a `build` target, but they're likely
        // not on an Angular version that supports standalone either.
        if (!((_a = project.targets) === null || _a === void 0 ? void 0 : _a.has('build'))) {
            return false;
        }
        return (0, ng_ast_utils_1.isStandaloneApp)(host, (0, project_main_file_1.getProjectMainFile)(project));
    });
}
/**
 * Gets the default value for the specified option. The default options will be determined
 * by looking at the stored schematic options for `@schematics/angular:component` in the
 * CLI workspace configuration.
 */
function getDefaultComponentOption(project, optionNames, fallbackValue) {
    const schematicOptions = (0, core_1.isJsonObject)(project.extensions['schematics'] || null)
        ? project.extensions['schematics']
        : null;
    const defaultSchematic = schematicOptions
        ? schematicOptions['@schematics/angular:component']
        : null;
    for (const optionName of optionNames) {
        if (defaultSchematic && defaultSchematic[optionName] != null) {
            return defaultSchematic[optionName];
        }
    }
    return fallbackValue;
}
//# sourceMappingURL=schematic-options.js.map