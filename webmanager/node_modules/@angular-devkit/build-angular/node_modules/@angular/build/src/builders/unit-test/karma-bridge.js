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
exports.useKarmaBuilder = useKarmaBuilder;
const options_1 = require("./options");
async function useKarmaBuilder(context, unitTestOptions) {
    if (unitTestOptions.debug) {
        context.logger.warn('The "karma" test runner does not support the "debug" option. The option will be ignored.');
    }
    if (unitTestOptions.setupFiles.length) {
        context.logger.warn('The "karma" test runner does not support the "setupFiles" option. The option will be ignored.');
    }
    const buildTargetOptions = (await context.validateOptions(await context.getTargetOptions(unitTestOptions.buildTarget), await context.getBuilderNameForTarget(unitTestOptions.buildTarget)));
    buildTargetOptions.polyfills = (0, options_1.injectTestingPolyfills)(buildTargetOptions.polyfills);
    const options = {
        tsConfig: unitTestOptions.tsConfig,
        polyfills: buildTargetOptions.polyfills,
        assets: buildTargetOptions.assets,
        scripts: buildTargetOptions.scripts,
        styles: buildTargetOptions.styles,
        inlineStyleLanguage: buildTargetOptions.inlineStyleLanguage,
        stylePreprocessorOptions: buildTargetOptions.stylePreprocessorOptions,
        externalDependencies: buildTargetOptions.externalDependencies,
        loader: buildTargetOptions.loader,
        define: buildTargetOptions.define,
        include: unitTestOptions.include,
        exclude: unitTestOptions.exclude,
        sourceMap: buildTargetOptions.sourceMap,
        progress: buildTargetOptions.progress,
        watch: unitTestOptions.watch,
        poll: buildTargetOptions.poll,
        preserveSymlinks: buildTargetOptions.preserveSymlinks,
        browsers: unitTestOptions.browsers?.join(','),
        codeCoverage: !!unitTestOptions.codeCoverage,
        codeCoverageExclude: unitTestOptions.codeCoverage?.exclude,
        fileReplacements: buildTargetOptions.fileReplacements,
        reporters: unitTestOptions.reporters,
        webWorkerTsConfig: buildTargetOptions.webWorkerTsConfig,
        aot: buildTargetOptions.aot,
    };
    const { execute } = await Promise.resolve().then(() => __importStar(require('../karma')));
    return execute(options, context);
}
