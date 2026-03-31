"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.FallbackRegistry = void 0;
const rxjs_1 = require("rxjs");
/**
 * A simple job registry that keep a map of JobName => JobHandler internally.
 */
class FallbackRegistry {
    _fallbacks;
    constructor(_fallbacks = []) {
        this._fallbacks = _fallbacks;
    }
    addFallback(registry) {
        this._fallbacks.push(registry);
    }
    get(name) {
        return (0, rxjs_1.from)(this._fallbacks).pipe((0, rxjs_1.concatMap)((fb) => fb.get(name)), (0, rxjs_1.first)((x) => x !== null, null));
    }
}
exports.FallbackRegistry = FallbackRegistry;
