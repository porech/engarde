"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.findElementsWithAttribute = findElementsWithAttribute;
exports.findAttributeOnElementWithTag = findAttributeOnElementWithTag;
exports.findAttributeOnElementWithAttrs = findAttributeOnElementWithAttrs;
exports.getStartOffsetOfAttribute = getStartOffsetOfAttribute;
const parse5_1 = require("parse5");
/**
 * Parses a HTML fragment and traverses all AST nodes in order find elements that
 * include the specified attribute.
 */
function findElementsWithAttribute(html, attributeName) {
    const document = (0, parse5_1.parseFragment)(html, { sourceCodeLocationInfo: true });
    const elements = [];
    const visitNodes = (nodes) => {
        nodes.forEach(n => {
            var _a;
            const node = n;
            if (node.childNodes) {
                visitNodes(node.childNodes);
            }
            if ((_a = node.attrs) === null || _a === void 0 ? void 0 : _a.some(attr => attr.name === attributeName.toLowerCase())) {
                elements.push(node);
            }
        });
    };
    visitNodes(document.childNodes);
    return elements;
}
/**
 * Finds elements with explicit tag names that also contain the specified attribute. Returns the
 * attribute start offset based on the specified HTML.
 */
function findAttributeOnElementWithTag(html, name, tagNames) {
    return findElementsWithAttribute(html, name)
        .filter(element => tagNames.includes(element.tagName))
        .map(element => getStartOffsetOfAttribute(element, name));
}
/**
 * Finds elements that contain the given attribute and contain at least one of the other
 * specified attributes. Returns the primary attribute's start offset based on the specified HTML.
 */
function findAttributeOnElementWithAttrs(html, name, attrs) {
    return findElementsWithAttribute(html, name)
        .filter(element => attrs.some(attr => hasElementAttribute(element, attr)))
        .map(element => getStartOffsetOfAttribute(element, name));
}
/** Shorthand function that checks if the specified element contains the given attribute. */
function hasElementAttribute(element, attributeName) {
    return element.attrs && element.attrs.some(attr => attr.name === attributeName.toLowerCase());
}
/** Gets the start offset of the given attribute from a Parse5 element. */
function getStartOffsetOfAttribute(element, attributeName) {
    return element.sourceCodeLocation.attrs[attributeName.toLowerCase()].startOffset;
}
//# sourceMappingURL=elements.js.map