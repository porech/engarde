"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPropertyNameText = getPropertyNameText;
exports.hasPropertyNameText = hasPropertyNameText;
const ts = require("typescript");
/**
 * Gets the text of the given property name. Returns null if the property
 * name couldn't be determined statically.
 */
function getPropertyNameText(node) {
    if (ts.isIdentifier(node) || ts.isStringLiteralLike(node)) {
        return node.text;
    }
    return null;
}
/** Checks whether the given property name has a text. */
function hasPropertyNameText(node) {
    return ts.isStringLiteral(node) || ts.isNumericLiteral(node) || ts.isIdentifier(node);
}
//# sourceMappingURL=property-name.js.map