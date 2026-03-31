"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
const helper_annotate_as_pure_1 = __importDefault(require("@babel/helper-annotate-as-pure"));
const tslib = __importStar(require("tslib"));
/**
 * A set of constructor names that are considered to be side-effect free.
 */
const sideEffectFreeConstructors = new Set(['InjectionToken']);
/**
 * A set of TypeScript helper function names used by the helper name matcher utility function.
 */
const tslibHelpers = new Set(Object.keys(tslib).filter((h) => h.startsWith('__')));
/**
 * Determinates whether an identifier name matches one of the TypeScript helper function names.
 *
 * @param name The identifier name to check.
 * @returns True, if the name matches a TypeScript helper name; otherwise, false.
 */
function isTslibHelperName(name) {
    const nameParts = name.split('$');
    const originalName = nameParts[0];
    if (nameParts.length > 2 || (nameParts.length === 2 && isNaN(+nameParts[1]))) {
        return false;
    }
    return tslibHelpers.has(originalName);
}
const babelHelpers = new Set(['_defineProperty']);
/**
 * Determinates whether an identifier name matches one of the Babel helper function names.
 *
 * @param name The identifier name to check.
 * @returns True, if the name matches a Babel helper name; otherwise, false.
 */
function isBabelHelperName(name) {
    return babelHelpers.has(name);
}
/**
 * A babel plugin factory function for adding the PURE annotation to top-level new and call expressions.
 * @returns A babel plugin object instance.
 */
function default_1() {
    return {
        visitor: {
            CallExpression(path, state) {
                const { topLevelSafeMode = false } = state.opts;
                if (topLevelSafeMode) {
                    return;
                }
                // If the expression has a function parent, it is not top-level
                if (path.getFunctionParent()) {
                    return;
                }
                const callee = path.get('callee');
                if ((callee.isFunctionExpression() || callee.isArrowFunctionExpression()) &&
                    path.node.arguments.length !== 0) {
                    return;
                }
                // Do not annotate TypeScript helpers emitted by the TypeScript compiler or Babel helpers.
                // They are intended to cause side effects.
                if (callee.isIdentifier() &&
                    (isTslibHelperName(callee.node.name) || isBabelHelperName(callee.node.name))) {
                    return;
                }
                (0, helper_annotate_as_pure_1.default)(path);
            },
            NewExpression(path, state) {
                // If the expression has a function parent, it is not top-level
                if (path.getFunctionParent()) {
                    return;
                }
                const { topLevelSafeMode = false } = state.opts;
                if (!topLevelSafeMode) {
                    (0, helper_annotate_as_pure_1.default)(path);
                    return;
                }
                const callee = path.get('callee');
                if (callee.isIdentifier() && sideEffectFreeConstructors.has(callee.node.name)) {
                    (0, helper_annotate_as_pure_1.default)(path);
                }
            },
        },
    };
}
