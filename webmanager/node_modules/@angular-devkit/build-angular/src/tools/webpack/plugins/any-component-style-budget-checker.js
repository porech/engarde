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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnyComponentStyleBudgetChecker = void 0;
const private_1 = require("@angular/build/private");
const path = __importStar(require("node:path"));
const webpack_1 = require("webpack");
const webpack_diagnostics_1 = require("../../../utils/webpack-diagnostics");
const PLUGIN_NAME = 'AnyComponentStyleBudgetChecker';
/**
 * Check budget sizes for component styles by emitting a warning or error if a
 * budget is exceeded by a particular component's styles.
 */
class AnyComponentStyleBudgetChecker {
    budgets;
    constructor(budgets) {
        this.budgets = budgets.filter((budget) => budget.type === private_1.BudgetType.AnyComponentStyle);
    }
    apply(compiler) {
        compiler.hooks.compilation.tap(PLUGIN_NAME, (compilation) => {
            compilation.hooks.processAssets.tap({
                name: PLUGIN_NAME,
                stage: webpack_1.Compilation.PROCESS_ASSETS_STAGE_ANALYSE,
            }, () => {
                // No budgets.
                if (this.budgets.length === 0) {
                    return;
                }
                // In AOT compilations component styles get processed in child compilations.
                if (!compilation.compiler.parentCompilation) {
                    return;
                }
                const cssExtensions = ['.css', '.scss', '.less', '.sass'];
                const componentStyles = Object.keys(compilation.assets)
                    .filter((name) => cssExtensions.includes(path.extname(name)))
                    .map((name) => ({
                    name,
                    size: compilation.assets[name].size(),
                    componentStyle: true,
                }));
                for (const { severity, message } of (0, private_1.checkBudgets)(this.budgets, { chunks: [], assets: componentStyles }, true)) {
                    switch (severity) {
                        case private_1.ThresholdSeverity.Warning:
                            (0, webpack_diagnostics_1.addWarning)(compilation, message);
                            break;
                        case private_1.ThresholdSeverity.Error:
                            (0, webpack_diagnostics_1.addError)(compilation, message);
                            break;
                        default:
                            assertNever(severity);
                    }
                }
            });
        });
    }
}
exports.AnyComponentStyleBudgetChecker = AnyComponentStyleBudgetChecker;
function assertNever(input) {
    throw new Error(`Unexpected call to assertNever() with input: ${JSON.stringify(input, null /* replacer */, 4 /* tabSize */)}`);
}
