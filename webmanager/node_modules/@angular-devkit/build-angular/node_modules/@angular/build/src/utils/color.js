"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.figures = exports.colors = void 0;
exports.supportColor = supportColor;
const node_tty_1 = require("node:tty");
var listr2_1 = require("listr2");
Object.defineProperty(exports, "colors", { enumerable: true, get: function () { return listr2_1.color; } });
Object.defineProperty(exports, "figures", { enumerable: true, get: function () { return listr2_1.figures; } });
function supportColor(stream = process.stdout) {
    if (stream instanceof node_tty_1.WriteStream) {
        return stream.hasColors();
    }
    try {
        // The hasColors function does not rely on any instance state and should ideally be static
        return node_tty_1.WriteStream.prototype.hasColors();
    }
    catch {
        return process.env['FORCE_COLOR'] !== undefined && process.env['FORCE_COLOR'] !== '0';
    }
}
