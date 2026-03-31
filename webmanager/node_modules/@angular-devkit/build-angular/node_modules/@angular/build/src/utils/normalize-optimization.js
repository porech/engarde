"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeOptimization = normalizeOptimization;
function normalizeOptimization(optimization = true) {
    if (typeof optimization === 'object') {
        const styleOptimization = !!optimization.styles;
        return {
            scripts: !!optimization.scripts,
            styles: typeof optimization.styles === 'object'
                ? optimization.styles
                : {
                    minify: styleOptimization,
                    removeSpecialComments: styleOptimization,
                    inlineCritical: styleOptimization,
                },
            fonts: typeof optimization.fonts === 'object'
                ? optimization.fonts
                : {
                    inline: !!optimization.fonts,
                },
        };
    }
    return {
        scripts: optimization,
        styles: {
            minify: optimization,
            inlineCritical: optimization,
            removeSpecialComments: optimization,
        },
        fonts: {
            inline: optimization,
        },
    };
}
