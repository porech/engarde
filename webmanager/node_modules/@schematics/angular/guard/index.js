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
const generate_from_files_1 = require("../utility/generate-from-files");
const schema_1 = require("./schema");
function default_1(options) {
    if (!options.implements) {
        throw new schematics_1.SchematicsException('Option "implements" is required.');
    }
    if (options.implements.length > 1 && options.functional) {
        throw new schematics_1.SchematicsException('Can only specify one value for implements when generating a functional guard.');
    }
    if (options.functional) {
        const guardType = options.implements[0] + 'Fn';
        return (0, generate_from_files_1.generateFromFiles)({ ...options, templateFilesDirectory: './type-files' }, { guardType });
    }
    else {
        const implementations = options.implements
            .map((implement) => (implement === 'CanDeactivate' ? 'CanDeactivate<unknown>' : implement))
            .join(', ');
        const commonRouterNameImports = ['ActivatedRouteSnapshot', 'RouterStateSnapshot'];
        const routerNamedImports = [...options.implements, 'MaybeAsync', 'GuardResult'];
        if (options.implements.includes(schema_1.Implement.CanMatch)) {
            routerNamedImports.push('Route', 'subPath');
            if (options.implements.length > 1) {
                routerNamedImports.push(...commonRouterNameImports);
            }
        }
        else {
            routerNamedImports.push(...commonRouterNameImports);
        }
        routerNamedImports.sort();
        const routerImports = routerNamedImports.join(', ');
        return (0, generate_from_files_1.generateFromFiles)({ ...options, templateFilesDirectory: './implements-files' }, {
            implementations,
            routerImports,
        });
    }
}
