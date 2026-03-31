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
exports.execute = execute;
exports.isEsbuildBased = isEsbuildBased;
const private_1 = require("@angular/build/private");
const rxjs_1 = require("rxjs");
const options_1 = require("./options");
/**
 * A Builder that executes a development server based on the provided browser target option.
 *
 * Usage of the `transforms` and/or `extensions` parameters is NOT supported and may cause
 * unexpected build output or build failures.
 *
 * @param options Dev Server options.
 * @param context The build context.
 * @param transforms A map of transforms that can be used to hook into some logic (such as
 * transforming webpack configuration before passing it to webpack).
 * @param extensions An optional object containing an array of build plugins (esbuild-based)
 * and/or HTTP request middleware.
 *
 * @experimental Direct usage of this function is considered experimental.
 */
function execute(options, context, transforms = {}, extensions) {
    // Determine project name from builder context target
    const projectName = context.target?.project;
    if (!projectName) {
        context.logger.error(`The "dev-server" builder requires a target to be specified.`);
        return rxjs_1.EMPTY;
    }
    return (0, rxjs_1.defer)(() => initialize(options, projectName, context, extensions?.builderSelector)).pipe((0, rxjs_1.switchMap)(({ builderName, normalizedOptions }) => {
        // Use vite-based development server for esbuild-based builds
        if (isEsbuildBased(builderName)) {
            if (transforms?.logging || transforms?.webpackConfiguration) {
                throw new Error(`The "application" and "browser-esbuild" builders do not support Webpack transforms.`);
            }
            if (options.publicHost) {
                context.logger.warn(`The "publicHost" option will not be used because it is not supported by the "${builderName}" builder.`);
            }
            if (options.disableHostCheck) {
                context.logger.warn(`The "disableHostCheck" option will not be used because it is not supported by the "${builderName}" builder.`);
            }
            // New build system defaults hmr option to the value of liveReload
            normalizedOptions.hmr ??= normalizedOptions.liveReload;
            // New build system uses Vite's allowedHost option convention of true for disabling host checks
            if (normalizedOptions.disableHostCheck) {
                normalizedOptions.allowedHosts = true;
            }
            else {
                normalizedOptions.allowedHosts ??= [];
            }
            return (0, rxjs_1.defer)(() => Promise.all([Promise.resolve().then(() => __importStar(require('@angular/build/private'))), Promise.resolve().then(() => __importStar(require('../browser-esbuild')))])).pipe((0, rxjs_1.switchMap)(([{ serveWithVite, buildApplicationInternal }, { convertBrowserOptions }]) => serveWithVite(normalizedOptions, builderName, (options, context, codePlugins) => {
                return builderName === '@angular-devkit/build-angular:browser-esbuild'
                    ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        buildApplicationInternal(convertBrowserOptions(options), context, {
                            codePlugins,
                        })
                    : buildApplicationInternal(options, context, { codePlugins });
            }, context, transforms, extensions)));
        }
        // Warn if the initial options provided by the user enable prebundling with Webpack-based builders
        if (options.prebundle) {
            context.logger.warn(`Prebundling has been configured but will not be used because it is not supported by the "${builderName}" builder.`);
        }
        if (extensions?.buildPlugins?.length) {
            throw new Error('Only the "application" and "browser-esbuild" builders support plugins.');
        }
        if (extensions?.middleware?.length) {
            throw new Error('Only the "application" and "browser-esbuild" builders support middleware.');
        }
        // Webpack based build systems default to false for hmr option
        normalizedOptions.hmr ??= false;
        // Use Webpack for all other browser targets
        return (0, rxjs_1.defer)(() => Promise.resolve().then(() => __importStar(require('./webpack-server')))).pipe((0, rxjs_1.switchMap)(({ serveWebpackBrowser }) => serveWebpackBrowser(normalizedOptions, builderName, context, transforms)));
    }));
}
async function initialize(initialOptions, projectName, context, builderSelector = defaultBuilderSelector) {
    // Purge old build disk cache.
    await (0, private_1.purgeStaleBuildCache)(context);
    const normalizedOptions = await (0, options_1.normalizeOptions)(context, projectName, initialOptions);
    const builderName = builderSelector({
        builderName: await context.getBuilderNameForTarget(normalizedOptions.buildTarget),
        forceEsbuild: !!normalizedOptions.forceEsbuild,
    }, context.logger);
    if (!normalizedOptions.disableHostCheck &&
        !/^127\.\d+\.\d+\.\d+/g.test(normalizedOptions.host) &&
        normalizedOptions.host !== 'localhost') {
        context.logger.warn(`
Warning: This is a simple server for use in testing or debugging Angular applications
locally. It hasn't been reviewed for security issues.

Binding this server to an open connection can result in compromising your application or
computer. Using a different host than the one passed to the "--host" flag might result in
websocket connection issues. You might need to use "--disable-host-check" if that's the
case.
    `);
    }
    if (normalizedOptions.disableHostCheck) {
        context.logger.warn('Warning: Running a server with --disable-host-check is a security risk. ' +
            'See https://medium.com/webpack/webpack-dev-server-middleware-security-issues-1489d950874a for more information.');
    }
    normalizedOptions.port = await (0, private_1.checkPort)(normalizedOptions.port, normalizedOptions.host);
    return {
        builderName,
        normalizedOptions,
    };
}
function isEsbuildBased(builderName) {
    if (builderName === '@angular/build:application' ||
        builderName === '@angular-devkit/build-angular:application' ||
        builderName === '@angular-devkit/build-angular:browser-esbuild') {
        return true;
    }
    return false;
}
function defaultBuilderSelector(info, logger) {
    if (isEsbuildBased(info.builderName)) {
        return info.builderName;
    }
    if (info.forceEsbuild) {
        if (!info.builderName.startsWith('@angular-devkit/build-angular:')) {
            logger.warn('Warning: Forcing the use of the esbuild-based build system with third-party builders' +
                ' may cause unexpected behavior and/or build failures.');
        }
        // The compatibility builder should be used if esbuild is force enabled.
        return '@angular-devkit/build-angular:browser-esbuild';
    }
    return info.builderName;
}
