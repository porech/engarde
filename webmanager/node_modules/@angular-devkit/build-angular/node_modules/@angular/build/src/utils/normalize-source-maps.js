"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeSourceMaps = normalizeSourceMaps;
function normalizeSourceMaps(sourceMap) {
    const scripts = typeof sourceMap === 'object' ? sourceMap.scripts : sourceMap;
    const styles = typeof sourceMap === 'object' ? sourceMap.styles : sourceMap;
    const hidden = (typeof sourceMap === 'object' && sourceMap.hidden) || false;
    const vendor = (typeof sourceMap === 'object' && sourceMap.vendor) || false;
    const sourcesContent = typeof sourceMap === 'object' ? sourceMap.sourcesContent : sourceMap;
    return {
        vendor,
        hidden,
        scripts,
        styles,
        sourcesContent,
    };
}
