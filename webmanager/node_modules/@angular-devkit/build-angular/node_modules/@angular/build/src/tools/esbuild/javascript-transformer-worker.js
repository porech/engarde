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
exports.default = transformJavaScript;
const core_1 = require("@babel/core");
const node_fs_1 = __importDefault(require("node:fs"));
const node_path_1 = __importDefault(require("node:path"));
const piscina_1 = __importDefault(require("piscina"));
const load_esm_1 = require("../../utils/load-esm");
const textDecoder = new TextDecoder();
const textEncoder = new TextEncoder();
/**
 * The function name prefix for all Angular partial compilation functions.
 * Used to determine if linking of a JavaScript file is required.
 * If any additional declarations are added or otherwise changed in the linker,
 * the names MUST begin with this prefix.
 */
const LINKER_DECLARATION_PREFIX = 'ɵɵngDeclare';
async function transformJavaScript(request) {
    const { filename, data, ...options } = request;
    const textData = typeof data === 'string' ? data : textDecoder.decode(data);
    const transformedData = await transformWithBabel(filename, textData, options);
    // Transfer the data via `move` instead of cloning
    return piscina_1.default.move(textEncoder.encode(transformedData));
}
/**
 * Cached instance of the compiler-cli linker's createEs2015LinkerPlugin function.
 */
let linkerPluginCreator;
async function transformWithBabel(filename, data, options) {
    const shouldLink = !options.skipLinker && (await requiresLinking(filename, data));
    const useInputSourcemap = options.sourcemap &&
        (!!options.thirdPartySourcemaps || !/[\\/]node_modules[\\/]/.test(filename));
    const plugins = [];
    if (options.instrumentForCoverage) {
        const { default: coveragePlugin } = await Promise.resolve().then(() => __importStar(require('../babel/plugins/add-code-coverage.js')));
        plugins.push(coveragePlugin);
    }
    if (shouldLink) {
        // Lazy load the linker plugin only when linking is required
        const linkerPlugin = await createLinkerPlugin(options);
        plugins.push(linkerPlugin);
    }
    if (options.advancedOptimizations) {
        const { adjustStaticMembers, adjustTypeScriptEnums, elideAngularMetadata, markTopLevelPure } = await Promise.resolve().then(() => __importStar(require('../babel/plugins')));
        const sideEffectFree = options.sideEffects === false;
        const safeAngularPackage = sideEffectFree && /[\\/]node_modules[\\/]@angular[\\/]/.test(filename);
        plugins.push([markTopLevelPure, { topLevelSafeMode: !safeAngularPackage }], elideAngularMetadata, adjustTypeScriptEnums, [adjustStaticMembers, { wrapDecorators: sideEffectFree }]);
    }
    // If no additional transformations are needed, return the data directly
    if (plugins.length === 0) {
        // Strip sourcemaps if they should not be used
        return useInputSourcemap ? data : data.replace(/^\/\/# sourceMappingURL=[^\r\n]*/gm, '');
    }
    const result = await (0, core_1.transformAsync)(data, {
        filename,
        inputSourceMap: (useInputSourcemap ? undefined : false),
        sourceMaps: useInputSourcemap ? 'inline' : false,
        compact: false,
        configFile: false,
        babelrc: false,
        browserslistConfigFile: false,
        plugins,
    });
    const outputCode = result?.code ?? data;
    // Strip sourcemaps if they should not be used.
    // Babel will keep the original comments even if sourcemaps are disabled.
    return useInputSourcemap
        ? outputCode
        : outputCode.replace(/^\/\/# sourceMappingURL=[^\r\n]*/gm, '');
}
async function requiresLinking(path, source) {
    // @angular/core and @angular/compiler will cause false positives
    // Also, TypeScript files do not require linking
    if (/[\\/]@angular[\\/](?:compiler|core)|\.tsx?$/.test(path)) {
        return false;
    }
    // Check if the source code includes one of the declaration functions.
    // There is a low chance of a false positive but the names are fairly unique
    // and the result would be an unnecessary no-op additional plugin pass.
    return source.includes(LINKER_DECLARATION_PREFIX);
}
async function createLinkerPlugin(options) {
    linkerPluginCreator ??= (await (0, load_esm_1.loadEsmModule)('@angular/compiler-cli/linker/babel')).createEs2015LinkerPlugin;
    const linkerPlugin = linkerPluginCreator({
        linkerJitMode: options.jit,
        // This is a workaround until https://github.com/angular/angular/issues/42769 is fixed.
        sourceMapping: false,
        logger: {
            level: 1, // Info level
            debug(...args) {
                // eslint-disable-next-line no-console
                console.debug(args);
            },
            info(...args) {
                // eslint-disable-next-line no-console
                console.info(args);
            },
            warn(...args) {
                // eslint-disable-next-line no-console
                console.warn(args);
            },
            error(...args) {
                // eslint-disable-next-line no-console
                console.error(args);
            },
        },
        fileSystem: {
            resolve: node_path_1.default.resolve,
            exists: node_fs_1.default.existsSync,
            dirname: node_path_1.default.dirname,
            relative: node_path_1.default.relative,
            readFile: node_fs_1.default.readFileSync,
            // Node.JS types don't overlap the Compiler types.
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        },
    });
    return linkerPlugin;
}
