"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateRecorderBase = exports.IndexOutOfBoundException = void 0;
const core_1 = require("@angular-devkit/core");
const magic_string_1 = __importDefault(require("magic-string"));
const exception_1 = require("../exception/exception");
class IndexOutOfBoundException extends core_1.BaseException {
    constructor(index, min, max = Infinity) {
        super(`Index ${index} outside of range [${min}, ${max}].`);
    }
}
exports.IndexOutOfBoundException = IndexOutOfBoundException;
class UpdateRecorderBase {
    data;
    bom;
    _path;
    content;
    constructor(data, path, encoding = 'utf-8', bom = false) {
        this.data = data;
        this.bom = bom;
        let text;
        try {
            text = new TextDecoder(encoding, { fatal: true, ignoreBOM: false }).decode(data);
        }
        catch (e) {
            if (e instanceof TypeError) {
                throw new Error(`Failed to decode "${path}" as ${encoding} text.`);
            }
            throw e;
        }
        this._path = path;
        this.content = new magic_string_1.default(text);
    }
    static createFromFileEntry(entry) {
        const c0 = entry.content.byteLength > 0 && entry.content.readUInt8(0);
        const c1 = entry.content.byteLength > 1 && entry.content.readUInt8(1);
        const c2 = entry.content.byteLength > 2 && entry.content.readUInt8(2);
        // Check if we're BOM.
        if (c0 == 0xef && c1 == 0xbb && c2 == 0xbf) {
            return new UpdateRecorderBase(entry.content, entry.path, 'utf-8', true);
        }
        else if (c0 === 0xff && c1 == 0xfe) {
            return new UpdateRecorderBase(entry.content, entry.path, 'utf-16le', true);
        }
        else if (c0 === 0xfe && c1 == 0xff) {
            return new UpdateRecorderBase(entry.content, entry.path, 'utf-16be', true);
        }
        return new UpdateRecorderBase(entry.content, entry.path);
    }
    get path() {
        return this._path;
    }
    _assertIndex(index) {
        if (index < 0 || index > this.content.original.length) {
            throw new IndexOutOfBoundException(index, 0, this.content.original.length);
        }
    }
    // These just record changes.
    insertLeft(index, content) {
        this._assertIndex(index);
        this.content.appendLeft(index, content.toString());
        return this;
    }
    insertRight(index, content) {
        this._assertIndex(index);
        this.content.appendRight(index, content.toString());
        return this;
    }
    remove(index, length) {
        this._assertIndex(index);
        this.content.remove(index, index + length);
        return this;
    }
    apply(content) {
        if (!content.equals(this.data)) {
            throw new exception_1.ContentHasMutatedException(this.path);
        }
        // Schematics only support writing UTF-8 text
        const result = Buffer.from((this.bom ? '\uFEFF' : '') + this.content.toString(), 'utf-8');
        return result;
    }
}
exports.UpdateRecorderBase = UpdateRecorderBase;
