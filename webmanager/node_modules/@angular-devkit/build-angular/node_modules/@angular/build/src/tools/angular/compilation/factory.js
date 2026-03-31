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
exports.createAngularCompilation = createAngularCompilation;
const environment_options_1 = require("../../../utils/environment-options");
/**
 * Creates an Angular compilation object that can be used to perform Angular application
 * compilation either for AOT or JIT mode. By default a parallel compilation is created
 * that uses a Node.js worker thread.
 * @param jit True, for Angular JIT compilation; False, for Angular AOT compilation.
 * @param browserOnlyBuild True, for browser only builds; False, for browser and server builds.
 * @returns An instance of an Angular compilation object.
 */
async function createAngularCompilation(jit, browserOnlyBuild, parallel = environment_options_1.useParallelTs) {
    if (parallel) {
        const { ParallelCompilation } = await Promise.resolve().then(() => __importStar(require('./parallel-compilation')));
        return new ParallelCompilation(jit, browserOnlyBuild);
    }
    if (jit) {
        const { JitCompilation } = await Promise.resolve().then(() => __importStar(require('./jit-compilation')));
        return new JitCompilation(browserOnlyBuild);
    }
    else {
        const { AotCompilation } = await Promise.resolve().then(() => __importStar(require('./aot-compilation')));
        return new AotCompilation(browserOnlyBuild);
    }
}
