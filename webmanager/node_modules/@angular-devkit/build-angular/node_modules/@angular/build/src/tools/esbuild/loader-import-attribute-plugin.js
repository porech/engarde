"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLoaderImportAttributePlugin = createLoaderImportAttributePlugin;
const promises_1 = require("node:fs/promises");
const SUPPORTED_LOADERS = ['base64', 'binary', 'dataurl', 'file', 'text'];
function createLoaderImportAttributePlugin() {
    return {
        name: 'angular-loader-import-attributes',
        setup(build) {
            build.onLoad({ filter: /./ }, async (args) => {
                const loader = args.with['loader'];
                if (!loader) {
                    return undefined;
                }
                if (!SUPPORTED_LOADERS.includes(loader)) {
                    return {
                        errors: [
                            {
                                text: 'Unsupported loader import attribute',
                                notes: [
                                    { text: 'Attribute value must be one of: ' + SUPPORTED_LOADERS.join(', ') },
                                ],
                            },
                        ],
                    };
                }
                return {
                    contents: await (0, promises_1.readFile)(args.path),
                    loader,
                };
            });
        },
    };
}
