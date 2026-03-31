"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.JSONFile = void 0;
const jsonc_parser_1 = require("jsonc-parser");
const eol_1 = require("./eol");
/** @private */
class JSONFile {
    host;
    path;
    content;
    eol;
    constructor(host, path) {
        this.host = host;
        this.path = path;
        this.content = this.host.readText(this.path);
        this.eol = (0, eol_1.getEOL)(this.content);
    }
    _jsonAst;
    get JsonAst() {
        if (this._jsonAst) {
            return this._jsonAst;
        }
        const errors = [];
        this._jsonAst = (0, jsonc_parser_1.parseTree)(this.content, errors, { allowTrailingComma: true });
        if (errors.length) {
            const { error, offset } = errors[0];
            throw new Error(`Failed to parse "${this.path}" as JSON AST Object. ${(0, jsonc_parser_1.printParseErrorCode)(error)} at location: ${offset}.`);
        }
        return this._jsonAst;
    }
    get(jsonPath) {
        const jsonAstNode = this.JsonAst;
        if (!jsonAstNode) {
            return undefined;
        }
        if (jsonPath.length === 0) {
            return (0, jsonc_parser_1.getNodeValue)(jsonAstNode);
        }
        const node = (0, jsonc_parser_1.findNodeAtLocation)(jsonAstNode, jsonPath);
        return node === undefined ? undefined : (0, jsonc_parser_1.getNodeValue)(node);
    }
    modify(jsonPath, value, insertInOrder) {
        let getInsertionIndex;
        if (insertInOrder === undefined) {
            const property = jsonPath.slice(-1)[0];
            getInsertionIndex = (properties) => [...properties, property].sort().findIndex((p) => p === property);
        }
        else if (insertInOrder !== false) {
            getInsertionIndex = insertInOrder;
        }
        const edits = (0, jsonc_parser_1.modify)(this.content, jsonPath, value, {
            getInsertionIndex,
            formattingOptions: {
                eol: this.eol,
                insertSpaces: true,
                tabSize: 2,
            },
        });
        if (edits.length > 0) {
            const editedContent = (0, jsonc_parser_1.applyEdits)(this.content, edits);
            // Update the file content if it changed
            if (editedContent !== this.content) {
                this.content = editedContent;
                this.host.overwrite(this.path, editedContent);
                this._jsonAst = undefined;
            }
        }
    }
    remove(jsonPath) {
        if (this.get(jsonPath) !== undefined) {
            this.modify(jsonPath, undefined);
        }
    }
}
exports.JSONFile = JSONFile;
