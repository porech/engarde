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
exports.CodeBlock = void 0;
const typescript_1 = __importDefault(require("../../third_party/github.com/Microsoft/TypeScript/lib/typescript"));
const ast_utils_1 = require("../ast-utils");
const change_1 = require("../change");
/** Counter used to generate unique IDs. */
let uniqueIdCounter = 0;
/**
 * Utility class used to generate blocks of code that
 * can be inserted by the devkit into a user's app.
 */
class CodeBlock {
    _imports = new Map();
    // Note: the methods here are defined as arrow function so that they can be destructured by
    // consumers without losing their context. This makes the API more concise.
    /** Function used to tag a code block in order to produce a `PendingCode` object. */
    code = (strings, ...params) => {
        return {
            expression: strings.map((part, index) => part + (params[index] || '')).join(''),
            imports: this._imports,
        };
    };
    /**
     * Used inside of a code block to mark external symbols and which module they should be imported
     * from. When the code is inserted, the required import statements will be produced automatically.
     * @param symbolName Name of the external symbol.
     * @param moduleName Module from which the symbol should be imported.
     */
    external = (symbolName, moduleName) => {
        if (!this._imports.has(moduleName)) {
            this._imports.set(moduleName, new Map());
        }
        const symbolsPerModule = this._imports.get(moduleName);
        if (!symbolsPerModule.has(symbolName)) {
            symbolsPerModule.set(symbolName, `@@__SCHEMATIC_PLACEHOLDER_${uniqueIdCounter++}__@@`);
        }
        return symbolsPerModule.get(symbolName);
    };
    /**
     * Produces the necessary rules to transform a `PendingCode` object into valid code.
     * @param initialCode Code pending transformed.
     * @param filePath Path of the file in which the code will be inserted.
     */
    static transformPendingCode(initialCode, filePath) {
        const code = { ...initialCode };
        const rules = [];
        code.imports.forEach((symbols, moduleName) => {
            symbols.forEach((placeholder, symbolName) => {
                rules.push((tree) => {
                    const recorder = tree.beginUpdate(filePath);
                    const sourceFile = typescript_1.default.createSourceFile(filePath, tree.readText(filePath), typescript_1.default.ScriptTarget.Latest, true);
                    // Note that this could still technically clash if there's a top-level symbol called
                    // `${symbolName}_alias`, however this is unlikely. We can revisit this if it becomes
                    // a problem.
                    const alias = (0, ast_utils_1.hasTopLevelIdentifier)(sourceFile, symbolName, moduleName)
                        ? symbolName + '_alias'
                        : undefined;
                    code.expression = code.expression.replace(new RegExp(placeholder, 'g'), alias || symbolName);
                    (0, change_1.applyToUpdateRecorder)(recorder, [
                        (0, ast_utils_1.insertImport)(sourceFile, filePath, symbolName, moduleName, false, alias),
                    ]);
                    tree.commitUpdate(recorder);
                });
            });
        });
        return { code, rules };
    }
}
exports.CodeBlock = CodeBlock;
