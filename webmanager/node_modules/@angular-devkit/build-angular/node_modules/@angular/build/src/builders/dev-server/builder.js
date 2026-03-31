"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.execute = execute;
const check_port_1 = require("../../utils/check-port");
const internal_1 = require("./internal");
const options_1 = require("./options");
const vite_server_1 = require("./vite-server");
/**
 * A Builder that executes a development server based on the provided browser target option.
 *
 * Usage of the `transforms` and/or `extensions` parameters is NOT supported and may cause
 * unexpected build output or build failures.
 *
 * @param options Dev Server options.
 * @param context The build context.
 * @param extensions An optional object containing an array of build plugins (esbuild-based)
 * and/or HTTP request middleware.
 *
 * @experimental Direct usage of this function is considered experimental.
 */
async function* execute(options, context, extensions) {
    // Determine project name from builder context target
    const projectName = context.target?.project;
    if (!projectName) {
        context.logger.error(`The "dev-server" builder requires a target to be specified.`);
        return;
    }
    const { builderName, normalizedOptions } = await initialize(options, projectName, context);
    yield* (0, vite_server_1.serveWithVite)(normalizedOptions, builderName, (options, context, plugins) => (0, internal_1.buildApplicationInternal)(options, context, { codePlugins: plugins }), context, { indexHtml: extensions?.indexHtmlTransformer }, extensions);
}
async function initialize(initialOptions, projectName, context) {
    // Purge old build disk cache.
    await (0, internal_1.purgeStaleBuildCache)(context);
    const normalizedOptions = await (0, options_1.normalizeOptions)(context, projectName, initialOptions);
    const builderName = await context.getBuilderNameForTarget(normalizedOptions.buildTarget);
    if (!/^127\.\d+\.\d+\.\d+/g.test(normalizedOptions.host) &&
        normalizedOptions.host !== '::1' &&
        normalizedOptions.host !== 'localhost') {
        context.logger.warn(`
Warning: This is a simple server for use in testing or debugging Angular applications
locally. It hasn't been reviewed for security issues.

Binding this server to an open connection can result in compromising your application or
computer. Using a different host than the one passed to the "--host" flag might result in
websocket connection issues.
    `);
    }
    normalizedOptions.port = await (0, check_port_1.checkPort)(normalizedOptions.port, normalizedOptions.host);
    return {
        builderName,
        normalizedOptions,
    };
}
