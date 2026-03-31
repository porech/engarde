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
exports.AngularCompilation = exports.DiagnosticModes = void 0;
const load_esm_1 = require("../../../utils/load-esm");
const diagnostics_1 = require("../../esbuild/angular/diagnostics");
const profiling_1 = require("../../esbuild/profiling");
var DiagnosticModes;
(function (DiagnosticModes) {
    DiagnosticModes[DiagnosticModes["None"] = 0] = "None";
    DiagnosticModes[DiagnosticModes["Option"] = 1] = "Option";
    DiagnosticModes[DiagnosticModes["Syntactic"] = 2] = "Syntactic";
    DiagnosticModes[DiagnosticModes["Semantic"] = 4] = "Semantic";
    DiagnosticModes[DiagnosticModes["All"] = 7] = "All";
})(DiagnosticModes || (exports.DiagnosticModes = DiagnosticModes = {}));
class AngularCompilation {
    static #angularCompilerCliModule;
    static #typescriptModule;
    static async loadCompilerCli() {
        // This uses a wrapped dynamic import to load `@angular/compiler-cli` which is ESM.
        // Once TypeScript provides support for retaining dynamic imports this workaround can be dropped.
        AngularCompilation.#angularCompilerCliModule ??=
            await (0, load_esm_1.loadEsmModule)('@angular/compiler-cli');
        return AngularCompilation.#angularCompilerCliModule;
    }
    static async loadTypescript() {
        AngularCompilation.#typescriptModule ??= await Promise.resolve().then(() => __importStar(require('typescript')));
        return AngularCompilation.#typescriptModule;
    }
    async loadConfiguration(tsconfig) {
        const { readConfiguration } = await AngularCompilation.loadCompilerCli();
        return (0, profiling_1.profileSync)('NG_READ_CONFIG', () => readConfiguration(tsconfig, {
            // Angular specific configuration defaults and overrides to ensure a functioning compilation.
            suppressOutputPathCheck: true,
            outDir: undefined,
            sourceMap: false,
            declaration: false,
            declarationMap: false,
            allowEmptyCodegenFiles: false,
            annotationsAs: 'decorators',
            enableResourceInlining: false,
            supportTestBed: false,
            supportJitMode: false,
            // Disable removing of comments as TS is quite aggressive with these and can
            // remove important annotations, such as /* @__PURE__ */ and comments like /* vite-ignore */.
            removeComments: false,
        }));
    }
    async diagnoseFiles(modes = DiagnosticModes.All) {
        const result = {};
        // Avoid loading typescript until actually needed.
        // This allows for avoiding the load of typescript in the main thread when using the parallel compilation.
        const typescript = await AngularCompilation.loadTypescript();
        await (0, profiling_1.profileAsync)('NG_DIAGNOSTICS_TOTAL', async () => {
            for (const diagnostic of await this.collectDiagnostics(modes)) {
                const message = (0, diagnostics_1.convertTypeScriptDiagnostic)(typescript, diagnostic);
                if (diagnostic.category === typescript.DiagnosticCategory.Error) {
                    (result.errors ??= []).push(message);
                }
                else {
                    (result.warnings ??= []).push(message);
                }
            }
        });
        return result;
    }
}
exports.AngularCompilation = AngularCompilation;
