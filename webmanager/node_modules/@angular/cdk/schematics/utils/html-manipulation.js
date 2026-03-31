"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.appendHtmlElementToHead = appendHtmlElementToHead;
exports.getHtmlHeadTagElement = getHtmlHeadTagElement;
exports.addBodyClass = addBodyClass;
const schematics_1 = require("@angular-devkit/schematics");
const parse5_element_1 = require("./parse5-element");
const parse5_1 = require("parse5");
/** Appends the given element HTML fragment to the `<head>` element of the specified HTML file. */
function appendHtmlElementToHead(host, htmlFilePath, elementHtml) {
    const htmlFileBuffer = host.read(htmlFilePath);
    if (!htmlFileBuffer) {
        throw new schematics_1.SchematicsException(`Could not read file for path: ${htmlFilePath}`);
    }
    const htmlContent = htmlFileBuffer.toString();
    if (htmlContent.includes(elementHtml)) {
        return;
    }
    const headTag = getHtmlHeadTagElement(htmlContent);
    if (!headTag) {
        throw Error(`Could not find '<head>' element in HTML file: ${htmlFileBuffer}`);
    }
    // We always have access to the source code location here because the `getHeadTagElement`
    // function explicitly has the `sourceCodeLocationInfo` option enabled.
    const endTagOffset = headTag.sourceCodeLocation.endTag.startOffset;
    const indentationOffset = (0, parse5_element_1.getChildElementIndentation)(headTag);
    const insertion = `${' '.repeat(indentationOffset)}${elementHtml}`;
    const recordedChange = host.beginUpdate(htmlFilePath).insertRight(endTagOffset, `${insertion}\n`);
    host.commitUpdate(recordedChange);
}
/** Parses the given HTML file and returns the head element if available. */
function getHtmlHeadTagElement(htmlContent) {
    return getElementByTagName('head', htmlContent);
}
/** Adds a class to the body of the document. */
function addBodyClass(host, htmlFilePath, className) {
    const htmlFileBuffer = host.read(htmlFilePath);
    if (!htmlFileBuffer) {
        throw new schematics_1.SchematicsException(`Could not read file for path: ${htmlFilePath}`);
    }
    const htmlContent = htmlFileBuffer.toString();
    const body = getElementByTagName('body', htmlContent);
    if (!body) {
        throw Error(`Could not find <body> element in HTML file: ${htmlFileBuffer}`);
    }
    const classAttribute = body.attrs.find(attribute => attribute.name === 'class');
    if (classAttribute) {
        const hasClass = classAttribute.value
            .split(' ')
            .map(part => part.trim())
            .includes(className);
        if (!hasClass) {
            // We have source code location info enabled, and we pre-checked that the element
            // has attributes, specifically the `class` attribute.
            const classAttributeLocation = body.sourceCodeLocation.attrs['class'];
            const recordedChange = host
                .beginUpdate(htmlFilePath)
                .insertRight(classAttributeLocation.endOffset - 1, ` ${className}`);
            host.commitUpdate(recordedChange);
        }
    }
    else {
        const recordedChange = host
            .beginUpdate(htmlFilePath)
            .insertRight(body.sourceCodeLocation.startTag.endOffset - 1, ` class="${className}"`);
        host.commitUpdate(recordedChange);
    }
}
/** Finds an element by its tag name. */
function getElementByTagName(tagName, htmlContent) {
    const document = (0, parse5_1.parse)(htmlContent, { sourceCodeLocationInfo: true });
    const nodeQueue = [...document.childNodes];
    while (nodeQueue.length) {
        const node = nodeQueue.shift();
        if (node.nodeName.toLowerCase() === tagName) {
            return node;
        }
        else if (node.childNodes) {
            nodeQueue.push(...node.childNodes);
        }
    }
    return null;
}
//# sourceMappingURL=html-manipulation.js.map