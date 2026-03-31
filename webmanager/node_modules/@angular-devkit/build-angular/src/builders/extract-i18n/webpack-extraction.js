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
exports.extractMessages = extractMessages;
const build_webpack_1 = require("@angular-devkit/build-webpack");
const rxjs_1 = require("rxjs");
const webpack_1 = __importDefault(require("webpack"));
const configs_1 = require("../../tools/webpack/configs");
const stats_1 = require("../../tools/webpack/utils/stats");
const webpack_browser_config_1 = require("../../utils/webpack-browser-config");
const schema_1 = require("../browser/schema");
class NoEmitPlugin {
    apply(compiler) {
        compiler.hooks.shouldEmit.tap('angular-no-emit', () => false);
    }
}
async function extractMessages(options, builderName, context, transforms = {}) {
    const messages = [];
    let useLegacyIds = true;
    const browserOptions = await context.validateOptions(await context.getTargetOptions(options.buildTarget), builderName);
    const builderOptions = {
        ...browserOptions,
        optimization: false,
        sourceMap: {
            scripts: true,
            styles: false,
            vendor: true,
        },
        buildOptimizer: false,
        aot: true,
        progress: options.progress,
        budgets: [],
        assets: [],
        scripts: [],
        styles: [],
        deleteOutputPath: false,
        extractLicenses: false,
        subresourceIntegrity: false,
        outputHashing: schema_1.OutputHashing.None,
        namedChunks: true,
        allowedCommonJsDependencies: undefined,
    };
    const { config } = await (0, webpack_browser_config_1.generateBrowserWebpackConfigFromContext)(builderOptions, context, (wco) => {
        // Default value for legacy message ids is currently true
        useLegacyIds = wco.tsConfig.options.enableI18nLegacyMessageIdFormat ?? true;
        const partials = [
            { plugins: [new NoEmitPlugin()] },
            (0, configs_1.getCommonConfig)(wco),
        ];
        // Add Ivy application file extractor support
        partials.unshift({
            module: {
                rules: [
                    {
                        test: /\.[cm]?[tj]sx?$/,
                        loader: require.resolve('./ivy-extract-loader'),
                        options: {
                            messageHandler: (fileMessages) => messages.push(...fileMessages),
                        },
                    },
                ],
            },
        });
        // Replace all stylesheets with empty content
        partials.push({
            module: {
                rules: [
                    {
                        test: /\.(css|scss|sass|less)$/,
                        loader: require.resolve('./empty-loader'),
                    },
                ],
            },
        });
        return partials;
    }, 
    // During extraction we don't need specific browser support.
    { supportedBrowsers: undefined });
    const builderResult = await (0, rxjs_1.lastValueFrom)((0, build_webpack_1.runWebpack)((await transforms?.webpackConfiguration?.(config)) || config, context, {
        logging: (0, stats_1.createWebpackLoggingCallback)(builderOptions, context.logger),
        webpackFactory: webpack_1.default,
    }));
    return {
        builderResult,
        basePath: config.context || options.projectRoot,
        messages,
        useLegacyIds,
    };
}
