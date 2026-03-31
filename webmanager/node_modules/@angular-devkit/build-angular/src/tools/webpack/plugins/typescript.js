"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createIvyPlugin = createIvyPlugin;
const webpack_1 = require("@ngtools/webpack");
const typescript_1 = require("typescript");
function createIvyPlugin(wco, aot, tsconfig) {
    const { buildOptions, tsConfig } = wco;
    const optimize = buildOptions.optimization.scripts;
    const compilerOptions = {
        sourceMap: buildOptions.sourceMap.scripts,
        declaration: false,
        declarationMap: false,
        // Disable removing of comments as TS is quite aggressive with these and can
        // remove important annotations, such as /* @__PURE__ */.
        removeComments: false,
    };
    if (tsConfig.options.target === undefined || tsConfig.options.target < typescript_1.ScriptTarget.ES2022) {
        compilerOptions.target = typescript_1.ScriptTarget.ES2022;
        // If 'useDefineForClassFields' is already defined in the users project leave the value as is.
        // Otherwise fallback to false due to https://github.com/microsoft/TypeScript/issues/45995
        // which breaks the deprecated `@Effects` NGRX decorator and potentially other existing code as well.
        compilerOptions.useDefineForClassFields ??= false;
        wco.logger.warn('TypeScript compiler options "target" and "useDefineForClassFields" are set to "ES2022" and ' +
            '"false" respectively by the Angular CLI. To control ECMA version and features use the Browserslist configuration. ' +
            'For more information, see https://angular.dev/tools/cli/build#configuring-browser-compatibility\n' +
            `NOTE: You can set the "target" to "ES2022" in the project's tsconfig to remove this warning.`);
    }
    if (buildOptions.preserveSymlinks !== undefined) {
        compilerOptions.preserveSymlinks = buildOptions.preserveSymlinks;
    }
    const fileReplacements = {};
    if (buildOptions.fileReplacements) {
        for (const replacement of buildOptions.fileReplacements) {
            fileReplacements[replacement.replace] = replacement.with;
        }
    }
    return new webpack_1.AngularWebpackPlugin({
        tsconfig,
        compilerOptions,
        fileReplacements,
        jitMode: !aot,
        emitNgModuleScope: !optimize,
        inlineStyleFileExtension: buildOptions.inlineStyleLanguage ?? 'css',
    });
}
