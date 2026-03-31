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
exports.default = default_1;
const core_1 = require("@babel/core");
const istanbul_lib_instrument_1 = require("istanbul-lib-instrument");
const node_assert_1 = __importDefault(require("node:assert"));
/**
 * A babel plugin factory function for adding istanbul instrumentation.
 *
 * @returns A babel plugin object instance.
 */
function default_1() {
    const visitors = new WeakMap();
    return {
        visitor: {
            Program: {
                enter(path, state) {
                    const visitor = (0, istanbul_lib_instrument_1.programVisitor)(core_1.types, state.filename, {
                        // Babel returns a Converter object from the `convert-source-map` package
                        inputSourceMap: state.file.inputMap?.toObject(),
                    });
                    visitors.set(path, visitor);
                    visitor.enter(path);
                },
                exit(path) {
                    const visitor = visitors.get(path);
                    (0, node_assert_1.default)(visitor, 'Instrumentation visitor should always be present for program path.');
                    visitor.exit(path);
                    visitors.delete(path);
                },
            },
        },
    };
}
