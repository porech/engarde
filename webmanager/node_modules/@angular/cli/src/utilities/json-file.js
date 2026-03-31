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
exports.readAndParseJson = readAndParseJson;
exports.parseJson = parseJson;
const jsonc_parser_1 = require("jsonc-parser");
const node_fs_1 = require("node:fs");
const eol_1 = require("./eol");
const error_1 = require("./error");
/**
 * Represents a JSON file, allowing for reading, modifying, and saving.
 * This class uses `jsonc-parser` to preserve comments and formatting, including
 * indentation and end-of-line sequences.
 * @internal
 */
class JSONFile {
    /** The raw content of the JSON file. */
    #content;
    /** The end-of-line sequence used in the file. */
    #eol;
    /** Whether the file uses spaces for indentation. */
    #insertSpaces = true;
    /** The number of spaces or tabs used for indentation. */
    #tabSize = 2;
    /** The path to the JSON file. */
    #path;
    /** The parsed JSON abstract syntax tree. */
    #jsonAst;
    /** The raw content of the JSON file. */
    get content() {
        return this.#content;
    }
    /**
     * Creates an instance of JSONFile.
     * @param path The path to the JSON file.
     */
    constructor(path) {
        this.#path = path;
        try {
            this.#content = (0, node_fs_1.readFileSync)(this.#path, 'utf-8');
        }
        catch (e) {
            (0, error_1.assertIsError)(e);
            // We don't have to worry about ENOENT, since we'll be creating the file.
            if (e.code !== 'ENOENT') {
                throw e;
            }
            this.#content = '';
        }
        this.#eol = (0, eol_1.getEOL)(this.#content);
        this.#detectIndentation();
    }
    /**
     * Gets the parsed JSON abstract syntax tree.
     * The AST is lazily parsed and cached.
     */
    get JsonAst() {
        if (this.#jsonAst) {
            return this.#jsonAst;
        }
        const errors = [];
        this.#jsonAst = (0, jsonc_parser_1.parseTree)(this.#content, errors, { allowTrailingComma: true });
        if (errors.length) {
            formatError(this.#path, errors);
        }
        return this.#jsonAst;
    }
    /**
     * Gets a value from the JSON file at a specific path.
     * @param jsonPath The path to the value.
     * @returns The value at the given path, or `undefined` if not found.
     */
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
    /**
     * Modifies a value in the JSON file.
     * @param jsonPath The path to the value to modify.
     * @param value The new value to insert.
     * @param insertInOrder A function to determine the insertion index, or `false` to insert at the end.
     * @returns `true` if the modification was successful, `false` otherwise.
     */
    modify(jsonPath, value, insertInOrder) {
        if (value === undefined && this.get(jsonPath) === undefined) {
            // Cannot remove a value which doesn't exist.
            return false;
        }
        let getInsertionIndex;
        if (insertInOrder === undefined) {
            const property = jsonPath.slice(-1)[0];
            getInsertionIndex = (properties) => [...properties, property].sort().findIndex((p) => p === property);
        }
        else if (insertInOrder !== false) {
            getInsertionIndex = insertInOrder;
        }
        const edits = (0, jsonc_parser_1.modify)(this.#content, jsonPath, value, {
            getInsertionIndex,
            formattingOptions: {
                insertSpaces: this.#insertSpaces,
                tabSize: this.#tabSize,
                eol: this.#eol,
            },
        });
        if (edits.length === 0) {
            return false;
        }
        this.#content = (0, jsonc_parser_1.applyEdits)(this.#content, edits);
        this.#jsonAst = undefined;
        return true;
    }
    /**
     * Deletes a value from the JSON file at a specific path.
     * @param jsonPath The path to the value to delete.
     * @returns `true` if the deletion was successful, `false` otherwise.
     */
    delete(jsonPath) {
        return this.modify(jsonPath, undefined);
    }
    /** Saves the modified content back to the file. */
    save() {
        (0, node_fs_1.writeFileSync)(this.#path, this.#content);
    }
    /** Detects the indentation of the file. */
    #detectIndentation() {
        // Find the first line that has indentation.
        const match = this.#content.match(/^(?:( )+|\t+)\S/m);
        if (match) {
            this.#insertSpaces = !!match[1];
            this.#tabSize = match[0].length - 1;
        }
    }
}
exports.JSONFile = JSONFile;
/**
 * Reads and parses a JSON file, supporting comments and trailing commas.
 * @param path The path to the JSON file.
 * @returns The parsed JSON object.
 */
function readAndParseJson(path) {
    const errors = [];
    const content = (0, jsonc_parser_1.parse)((0, node_fs_1.readFileSync)(path, 'utf-8'), errors, { allowTrailingComma: true });
    if (errors.length) {
        formatError(path, errors);
    }
    return content;
}
/**
 * Formats a JSON parsing error and throws an exception.
 * @param path The path to the file that failed to parse.
 * @param errors The list of parsing errors.
 */
function formatError(path, errors) {
    const { error, offset } = errors[0];
    throw new Error(`Failed to parse "${path}" as JSON AST Object. ${(0, jsonc_parser_1.printParseErrorCode)(error)} at location: ${offset}.`);
}
/**
 * Parses a JSON string, supporting comments and trailing commas.
 * @param content The JSON string to parse.
 * @returns The parsed JSON object.
 */
function parseJson(content) {
    return (0, jsonc_parser_1.parse)(content, undefined, { allowTrailingComma: true });
}
