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
exports.getStylesConfig = getStylesConfig;
const private_1 = require("@angular/build/private");
const mini_css_extract_plugin_1 = __importDefault(require("mini-css-extract-plugin"));
const path = __importStar(require("node:path"));
const node_url_1 = require("node:url");
const plugins_1 = require("../plugins");
const css_optimizer_plugin_1 = require("../plugins/css-optimizer-plugin");
const styles_webpack_plugin_1 = require("../plugins/styles-webpack-plugin");
const helpers_1 = require("../utils/helpers");
// eslint-disable-next-line max-lines-per-function
async function getStylesConfig(wco) {
    const { root, buildOptions, logger, projectRoot } = wco;
    const extraPlugins = [];
    extraPlugins.push(new plugins_1.AnyComponentStyleBudgetChecker(buildOptions.budgets));
    const cssSourceMap = buildOptions.sourceMap.styles;
    // Determine hashing format.
    const hashFormat = (0, helpers_1.getOutputHashFormat)(buildOptions.outputHashing);
    // use includePaths from appConfig
    const includePaths = buildOptions.stylePreprocessorOptions?.includePaths?.map((p) => path.resolve(root, p)) ?? [];
    // Process global styles.
    if (buildOptions.styles.length > 0) {
        const { entryPoints, noInjectNames } = (0, helpers_1.normalizeGlobalStyles)(buildOptions.styles);
        extraPlugins.push(new styles_webpack_plugin_1.StylesWebpackPlugin({
            root,
            entryPoints,
            preserveSymlinks: buildOptions.preserveSymlinks,
        }));
        if (noInjectNames.length > 0) {
            // Add plugin to remove hashes from lazy styles.
            extraPlugins.push(new plugins_1.RemoveHashPlugin({ chunkNames: noInjectNames, hashFormat }));
        }
    }
    const sassImplementation = new private_1.SassWorkerImplementation();
    extraPlugins.push({
        apply(compiler) {
            compiler.hooks.shutdown.tap('sass-worker', () => {
                void sassImplementation.close();
            });
        },
    });
    const assetNameTemplate = (0, helpers_1.assetNameTemplateFactory)(hashFormat);
    const extraPostcssPlugins = [];
    const searchDirectories = await (0, private_1.generateSearchDirectories)([projectRoot, root]);
    const postcssConfig = await (0, private_1.loadPostcssConfiguration)(searchDirectories);
    if (postcssConfig) {
        for (const [pluginName, pluginOptions] of postcssConfig.plugins) {
            const resolvedPlugin = require.resolve(pluginName, { paths: [root] });
            const { default: plugin } = await Promise.resolve(`${resolvedPlugin}`).then(s => __importStar(require(s)));
            if (typeof plugin !== 'function' || plugin.postcss !== true) {
                throw new Error(`Attempted to load invalid Postcss plugin: "${pluginName}"`);
            }
            extraPostcssPlugins.push(plugin(pluginOptions));
        }
    }
    else {
        // Attempt to setup Tailwind CSS
        // Only load Tailwind CSS plugin if configuration file was found.
        // This acts as a guard to ensure the project actually wants to use Tailwind CSS.
        // The package may be unknowningly present due to a third-party transitive package dependency.
        const tailwindConfigPath = (0, private_1.findTailwindConfiguration)(searchDirectories);
        if (tailwindConfigPath) {
            let tailwindPackagePath;
            try {
                tailwindPackagePath = require.resolve('tailwindcss', { paths: [root] });
            }
            catch {
                const relativeTailwindConfigPath = path.relative(root, tailwindConfigPath);
                logger.warn(`Tailwind CSS configuration file found (${relativeTailwindConfigPath})` +
                    ` but the 'tailwindcss' package is not installed.` +
                    ` To enable Tailwind CSS, please install the 'tailwindcss' package.`);
            }
            if (tailwindPackagePath) {
                extraPostcssPlugins.push(require(tailwindPackagePath)({ config: tailwindConfigPath }));
            }
        }
    }
    const autoprefixer = require('autoprefixer');
    const postcssOptionsCreator = (inlineSourcemaps, extracted) => {
        const optionGenerator = (loader) => ({
            map: inlineSourcemaps
                ? {
                    inline: true,
                    annotation: false,
                }
                : undefined,
            plugins: [
                (0, plugins_1.PostcssCliResources)({
                    baseHref: buildOptions.baseHref,
                    deployUrl: buildOptions.deployUrl,
                    resourcesOutputPath: buildOptions.resourcesOutputPath,
                    loader,
                    filename: assetNameTemplate,
                    emitFile: buildOptions.platform !== 'server',
                    extracted,
                }),
                ...extraPostcssPlugins,
                autoprefixer({
                    ignoreUnknownVersions: true,
                    overrideBrowserslist: buildOptions.supportedBrowsers,
                }),
            ],
        });
        // postcss-loader fails when trying to determine configuration files for data URIs
        optionGenerator.config = false;
        return optionGenerator;
    };
    let componentsSourceMap = !!cssSourceMap;
    if (cssSourceMap) {
        if (buildOptions.optimization.styles.minify) {
            // Never use component css sourcemap when style optimizations are on.
            // It will just increase bundle size without offering good debug experience.
            logger.warn('Components styles sourcemaps are not generated when styles optimization is enabled.');
            componentsSourceMap = false;
        }
        else if (buildOptions.sourceMap.hidden) {
            // Inline all sourcemap types except hidden ones, which are the same as no sourcemaps
            // for component css.
            logger.warn('Components styles sourcemaps are not generated when sourcemaps are hidden.');
            componentsSourceMap = false;
        }
    }
    // extract global css from js files into own css file.
    extraPlugins.push(new mini_css_extract_plugin_1.default({ filename: `[name]${hashFormat.extract}.css` }));
    if (!buildOptions.hmr) {
        // don't remove `.js` files for `.css` when we are using HMR these contain HMR accept codes.
        // suppress empty .js files in css only entry points.
        extraPlugins.push(new plugins_1.SuppressExtractedTextChunksWebpackPlugin());
    }
    const postCss = require('postcss');
    const postCssLoaderPath = require.resolve('postcss-loader');
    const componentStyleLoaders = [
        {
            loader: require.resolve('css-loader'),
            options: {
                url: false,
                sourceMap: componentsSourceMap,
                importLoaders: 1,
                exportType: 'string',
                esModule: false,
            },
        },
        {
            loader: postCssLoaderPath,
            options: {
                implementation: postCss,
                postcssOptions: postcssOptionsCreator(componentsSourceMap, false),
            },
        },
    ];
    const globalStyleLoaders = [
        {
            loader: mini_css_extract_plugin_1.default.loader,
        },
        {
            loader: require.resolve('css-loader'),
            options: {
                url: false,
                sourceMap: !!cssSourceMap,
                importLoaders: 1,
            },
        },
        {
            loader: postCssLoaderPath,
            options: {
                implementation: postCss,
                postcssOptions: postcssOptionsCreator(false, true),
                sourceMap: !!cssSourceMap,
            },
        },
    ];
    const styleLanguages = [
        {
            extensions: ['css'],
            use: [],
        },
        {
            extensions: ['scss'],
            use: [
                {
                    loader: require.resolve('resolve-url-loader'),
                    options: {
                        sourceMap: cssSourceMap,
                    },
                },
                {
                    loader: require.resolve('sass-loader'),
                    options: getSassLoaderOptions(root, sassImplementation, includePaths, false, !!buildOptions.verbose, !!buildOptions.preserveSymlinks),
                },
            ],
        },
        {
            extensions: ['sass'],
            use: [
                {
                    loader: require.resolve('resolve-url-loader'),
                    options: {
                        sourceMap: cssSourceMap,
                    },
                },
                {
                    loader: require.resolve('sass-loader'),
                    options: getSassLoaderOptions(root, sassImplementation, includePaths, true, !!buildOptions.verbose, !!buildOptions.preserveSymlinks),
                },
            ],
        },
        {
            extensions: ['less'],
            use: [
                {
                    loader: require.resolve('less-loader'),
                    options: {
                        implementation: require('less'),
                        sourceMap: cssSourceMap,
                        lessOptions: {
                            javascriptEnabled: true,
                            paths: includePaths,
                        },
                    },
                },
            ],
        },
    ];
    return {
        module: {
            rules: styleLanguages.map(({ extensions, use }) => ({
                test: new RegExp(`\\.(?:${extensions.join('|')})$`, 'i'),
                rules: [
                    // Setup processing rules for global and component styles
                    {
                        oneOf: [
                            // Global styles are only defined global styles
                            {
                                use: globalStyleLoaders,
                                resourceQuery: /\?ngGlobalStyle/,
                            },
                            // Component styles are all styles except defined global styles
                            {
                                use: componentStyleLoaders,
                                resourceQuery: /\?ngResource/,
                            },
                        ],
                    },
                    { use },
                ],
            })),
        },
        optimization: {
            minimizer: buildOptions.optimization.styles.minify
                ? [
                    new css_optimizer_plugin_1.CssOptimizerPlugin({
                        supportedBrowsers: buildOptions.supportedBrowsers,
                    }),
                ]
                : undefined,
        },
        plugins: extraPlugins,
    };
}
function getSassLoaderOptions(root, implementation, includePaths, indentedSyntax, verbose, preserveSymlinks) {
    return {
        sourceMap: true,
        api: 'modern',
        implementation,
        // Webpack importer is only implemented in the legacy API and we have our own custom Webpack importer.
        // See: https://github.com/webpack-contrib/sass-loader/blob/997f3eb41d86dd00d5fa49c395a1aeb41573108c/src/utils.js#L642-L651
        webpackImporter: false,
        sassOptions: (loaderContext) => ({
            importers: [getSassResolutionImporter(loaderContext, root, preserveSymlinks)],
            loadPaths: includePaths,
            // Use expanded as otherwise sass will remove comments that are needed for autoprefixer
            // Ex: /* autoprefixer grid: autoplace */
            // See: https://github.com/webpack-contrib/sass-loader/blob/45ad0be17264ceada5f0b4fb87e9357abe85c4ff/src/getSassOptions.js#L68-L70
            style: 'expanded',
            // Silences compiler warnings from 3rd party stylesheets
            quietDeps: !verbose,
            verbose,
            syntax: indentedSyntax ? 'indented' : 'scss',
            sourceMapIncludeSources: true,
        }),
    };
}
function getSassResolutionImporter(loaderContext, root, preserveSymlinks) {
    const commonResolverOptions = {
        conditionNames: ['sass', 'style'],
        mainFields: ['sass', 'style', 'main', '...'],
        extensions: ['.scss', '.sass', '.css'],
        restrictions: [/\.((sa|sc|c)ss)$/i],
        preferRelative: true,
        symlinks: !preserveSymlinks,
    };
    // Sass also supports import-only files. If you name a file <name>.import.scss, it will only be loaded for imports, not for @uses.
    // See: https://sass-lang.com/documentation/at-rules/import#import-only-files
    const resolveImport = loaderContext.getResolve({
        ...commonResolverOptions,
        dependencyType: 'sass-import',
        mainFiles: ['_index.import', '_index', 'index.import', 'index', '...'],
    });
    const resolveModule = loaderContext.getResolve({
        ...commonResolverOptions,
        dependencyType: 'sass-module',
        mainFiles: ['_index', 'index', '...'],
    });
    return {
        findFileUrl: async (url, { fromImport, containingUrl }) => {
            if (url.charAt(0) === '.') {
                // Let Sass handle relative imports.
                return null;
            }
            let resolveDir = root;
            if (containingUrl) {
                resolveDir = path.dirname((0, node_url_1.fileURLToPath)(containingUrl));
            }
            const resolve = fromImport ? resolveImport : resolveModule;
            // Try to resolve from root of workspace
            const result = await tryResolve(resolve, resolveDir, url);
            return result ? (0, node_url_1.pathToFileURL)(result) : null;
        },
    };
}
async function tryResolve(resolve, root, url) {
    try {
        return await resolve(root, url);
    }
    catch {
        // Try to resolve a partial file
        // @use '@material/button/button' as mdc-button;
        // `@material/button/button` -> `@material/button/_button`
        const lastSlashIndex = url.lastIndexOf('/');
        const underscoreIndex = lastSlashIndex + 1;
        if (underscoreIndex > 0 && url.charAt(underscoreIndex) !== '_') {
            const partialFileUrl = `${url.slice(0, underscoreIndex)}_${url.slice(underscoreIndex)}`;
            return resolve(root, partialFileUrl).catch(() => undefined);
        }
    }
    return undefined;
}
