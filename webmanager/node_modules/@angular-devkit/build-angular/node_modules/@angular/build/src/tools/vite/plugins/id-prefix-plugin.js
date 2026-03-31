"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRemoveIdPrefixPlugin = createRemoveIdPrefixPlugin;
// NOTE: the implementation for this Vite plugin is roughly based on:
// https://github.com/MilanKovacic/vite-plugin-externalize-dependencies
const VITE_ID_PREFIX = '@id/';
const escapeRegexSpecialChars = (inputString) => {
    return inputString.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
};
function createRemoveIdPrefixPlugin(externals) {
    return {
        name: 'angular-plugin-remove-id-prefix',
        apply: 'serve',
        configResolved: (resolvedConfig) => {
            // don't do anything when the list of externals is empty
            if (externals.length === 0) {
                return;
            }
            const escapedExternals = externals.map((e) => escapeRegexSpecialChars(e) + '(?:/.+)?');
            const prefixedExternalRegex = new RegExp(`${resolvedConfig.base}${VITE_ID_PREFIX}(${escapedExternals.join('|')})`, 'g');
            // @ts-expect-error: Property 'push' does not exist on type 'readonly Plugin<any>[]'
            // Reasoning:
            //  since the /@id/ prefix is added by Vite's import-analysis plugin,
            //  we must add our actual plugin dynamically, to ensure that it will run
            //  AFTER the import-analysis.
            resolvedConfig.plugins.push({
                name: 'angular-plugin-remove-id-prefix-transform',
                transform: (code) => {
                    // don't do anything when code does not contain the Vite prefix
                    if (!code.includes(VITE_ID_PREFIX)) {
                        return code;
                    }
                    return code.replace(prefixedExternalRegex, (_, externalName) => externalName);
                },
            });
        },
    };
}
