"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCssInlineFontsPlugin = createCssInlineFontsPlugin;
const inline_fonts_1 = require("../../../utils/index-file/inline-fonts");
const load_result_cache_1 = require("../load-result-cache");
/**
 * Creates an esbuild {@link Plugin} that inlines fonts imported via import-rule.
 * within the build configuration.
 */
function createCssInlineFontsPlugin({ cache, cacheOptions, }) {
    return {
        name: 'angular-css-inline-fonts-plugin',
        setup(build) {
            const inlineFontsProcessor = new inline_fonts_1.InlineFontsProcessor({ cache: cacheOptions, minify: false });
            build.onResolve({ filter: /fonts\.googleapis\.com|use\.typekit\.net/ }, (args) => {
                // Only attempt to resolve import-rule tokens which only exist inside CSS.
                if (args.kind !== 'import-rule') {
                    return null;
                }
                if (!inlineFontsProcessor.canInlineRequest(args.path)) {
                    return null;
                }
                return {
                    path: args.path,
                    namespace: 'css-inline-fonts',
                };
            });
            build.onLoad({ filter: /./, namespace: 'css-inline-fonts' }, (0, load_result_cache_1.createCachedLoad)(cache, async (args) => {
                try {
                    return {
                        contents: await inlineFontsProcessor.processURL(args.path),
                        loader: 'css',
                    };
                }
                catch (error) {
                    return {
                        loader: 'css',
                        errors: [
                            {
                                text: `Failed to inline external stylesheet '${args.path}'.`,
                                notes: error instanceof Error ? [{ text: error.toString() }] : undefined,
                            },
                        ],
                    };
                }
            }));
        },
    };
}
