"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.OccurrencesPlugin = void 0;
const PLUGIN_NAME = 'angular-occurrences-plugin';
class OccurrencesPlugin {
    options;
    constructor(options) {
        this.options = options;
    }
    apply(compiler) {
        compiler.hooks.thisCompilation.tap(PLUGIN_NAME, (compilation) => {
            compilation.hooks.processAssets.tapPromise({
                name: PLUGIN_NAME,
                stage: compiler.webpack.Compilation.PROCESS_ASSETS_STAGE_ANALYSE,
            }, async (compilationAssets) => {
                for (const assetName of Object.keys(compilationAssets)) {
                    if (!assetName.endsWith('.js')) {
                        continue;
                    }
                    const scriptAsset = compilation.getAsset(assetName);
                    if (!scriptAsset || scriptAsset.source.size() <= 0) {
                        continue;
                    }
                    const src = scriptAsset.source.source().toString('utf-8');
                    let ngComponentCount = 0;
                    if (!this.options.aot) {
                        // Count the number of `Component({` strings (case sensitive), which happens in __decorate().
                        ngComponentCount += this.countOccurrences(src, 'Component({');
                    }
                    if (this.options.scriptsOptimization) {
                        // for ascii_only true
                        ngComponentCount += this.countOccurrences(src, '.\\u0275cmp', false);
                    }
                    else {
                        // For Ivy we just count ɵcmp.src
                        ngComponentCount += this.countOccurrences(src, '.ɵcmp', true);
                    }
                    compilation.updateAsset(assetName, (s) => s, (assetInfo) => ({
                        ...assetInfo,
                        ngComponentCount,
                    }));
                }
            });
        });
    }
    countOccurrences(source, match, wordBreak = false) {
        let count = 0;
        // We condition here so branch prediction happens out of the loop, not in it.
        if (wordBreak) {
            const re = /\w/;
            for (let pos = source.lastIndexOf(match); pos >= 0; pos = source.lastIndexOf(match, pos)) {
                if (!(re.test(source[pos - 1] || '') || re.test(source[pos + match.length] || ''))) {
                    count++; // 1 match, AH! AH! AH! 2 matches, AH! AH! AH!
                }
                pos -= match.length;
                if (pos < 0) {
                    break;
                }
            }
        }
        else {
            for (let pos = source.lastIndexOf(match); pos >= 0; pos = source.lastIndexOf(match, pos)) {
                count++; // 1 match, AH! AH! AH! 2 matches, AH! AH! AH!
                pos -= match.length;
                if (pos < 0) {
                    break;
                }
            }
        }
        return count;
    }
}
exports.OccurrencesPlugin = OccurrencesPlugin;
