"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultLogger = void 0;
exports.defaultLogger = {
    debug: m => console.debug(m),
    error: m => console.error(m),
    fatal: m => console.error(m),
    info: m => console.info(m),
    warn: m => console.warn(m),
};
//# sourceMappingURL=logger.js.map