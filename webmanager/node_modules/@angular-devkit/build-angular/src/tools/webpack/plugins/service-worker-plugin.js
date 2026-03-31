"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceWorkerPlugin = void 0;
const private_1 = require("@angular/build/private");
class ServiceWorkerPlugin {
    options;
    constructor(options) {
        this.options = options;
    }
    apply(compiler) {
        compiler.hooks.done.tapPromise('angular-service-worker', async (stats) => {
            if (stats.hasErrors()) {
                // Don't generate a service worker if the compilation has errors.
                // When there are errors some files will not be emitted which would cause other errors down the line such as readdir failures.
                return;
            }
            const { projectRoot, root, baseHref = '', ngswConfigPath } = this.options;
            const { compilation } = stats;
            // We use the output path from the compilation instead of build options since during
            // localization the output path is modified to a temp directory.
            // See: https://github.com/angular/angular-cli/blob/7e64b1537d54fadb650559214fbb12707324cd75/packages/angular_devkit/build_angular/src/utils/i18n-options.ts#L251-L252
            const outputPath = compilation.outputOptions.path;
            if (!outputPath) {
                throw new Error('Compilation output path cannot be empty.');
            }
            try {
                await (0, private_1.augmentAppWithServiceWorker)(projectRoot, root, outputPath, baseHref, ngswConfigPath, 
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                compiler.inputFileSystem.promises, 
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                compiler.outputFileSystem.promises);
            }
            catch (error) {
                compilation.errors.push(new compilation.compiler.webpack.WebpackError(`Failed to generate service worker - ${error instanceof Error ? error.message : error}`));
            }
        });
    }
}
exports.ServiceWorkerPlugin = ServiceWorkerPlugin;
