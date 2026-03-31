/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import type { BuilderContext } from '@angular-devkit/architect';
import type { Plugin } from 'esbuild';
import { I18nOptions } from '../../utils/i18n-options';
import { IndexHtmlTransform } from '../../utils/index-file/index-html-generator';
import { Schema as ApplicationBuilderOptions, ExperimentalPlatform, I18NTranslation, OutputMode, OutputPathClass } from './schema';
/**
 * The filename for the client-side rendered HTML template.
 * This template is used for client-side rendering (CSR) in a web application.
 */
export declare const INDEX_HTML_CSR = "index.csr.html";
/**
 * The filename for the server-side rendered HTML template.
 * This template is used for server-side rendering (SSR) in a web application.
 */
export declare const INDEX_HTML_SERVER = "index.server.html";
export type NormalizedOutputOptions = Required<OutputPathClass> & {
    clean: boolean;
    ignoreServer: boolean;
};
export type NormalizedApplicationBuildOptions = Awaited<ReturnType<typeof normalizeOptions>>;
export interface ApplicationBuilderExtensions {
    codePlugins?: Plugin[];
    indexHtmlTransformer?: IndexHtmlTransform;
}
/** Internal options hidden from builder schema but available when invoked programmatically. */
interface InternalOptions {
    /**
     * Entry points to use for the compilation. Incompatible with `browser`, which must not be provided. May be relative or absolute paths.
     * If given a relative path, it is resolved relative to the current workspace and will generate an output at the same relative location
     * in the output directory. If given an absolute path, the output will be generated in the root of the output directory with the same base
     * name.
     *
     * If provided a Map, the key is the name of the output bundle and the value is the entry point file.
     */
    entryPoints?: Set<string> | Map<string, string>;
    /** File extension to use for the generated output files. */
    outExtension?: 'js' | 'mjs';
    /**
     * Indicates whether all node packages should be marked as external.
     * Currently used by the dev-server to support prebundling.
     */
    externalPackages?: boolean | {
        exclude: string[];
    };
    /**
     * Forces the output from the localize post-processing to not create nested directories per locale output.
     * This is only used by the development server which currently only supports a single locale per build.
     */
    forceI18nFlatOutput?: boolean;
    /**
     * When set to `true`, enables fast SSR in development mode by disabling the full manifest generation and prerendering.
     *
     * This option is intended to optimize performance during development by skipping prerendering and route extraction when not required.
     * @default false
     */
    partialSSRBuild?: boolean;
    /**
     * Enables the use of AOT compiler emitted external runtime styles.
     * External runtime styles use `link` elements instead of embedded style content in the output JavaScript.
     * This option is only intended to be used with a development server that can process and serve component
     * styles.
     */
    externalRuntimeStyles?: boolean;
    /**
     * Enables the AOT compiler to generate template component update functions.
     * This option is only intended to be used with a development server that can process and serve component
     * template updates.
     */
    templateUpdates?: boolean;
    /**
     * Enables emitting incremental build results when in watch mode. A full build result will only be emitted
     * for the initial build. This option also requires watch to be enabled to have an effect.
     */
    incrementalResults?: boolean;
    /**
     * Enables instrumentation to collect code coverage data for specific files.
     *
     * Used exclusively for tests and shouldn't be used for other kinds of builds.
     */
    instrumentForCoverage?: (filename: string) => boolean;
}
/** Full set of options for `application` builder. */
export type ApplicationBuilderInternalOptions = Omit<ApplicationBuilderOptions & InternalOptions, 'browser'> & {
    browser?: string;
};
/**
 * Normalize the user provided options by creating full paths for all path based options
 * and converting multi-form options into a single form that can be directly used
 * by the build process.
 *
 * @param context The context for current builder execution.
 * @param projectName The name of the project for the current execution.
 * @param options An object containing the options to use for the build.
 * @param plugins An optional array of programmatically supplied build plugins.
 * @returns An object containing normalized options required to perform the build.
 */
export declare function normalizeOptions(context: BuilderContext, projectName: string, options: ApplicationBuilderInternalOptions, extensions?: ApplicationBuilderExtensions): Promise<{
    advancedOptimizations: boolean;
    allowedCommonJsDependencies: string[] | undefined;
    baseHref: string | undefined;
    cacheOptions: import("../../utils/normalize-cache").NormalizedCachedOptions;
    crossOrigin: import("./schema").CrossOrigin | undefined;
    externalDependencies: string[] | undefined;
    externalPackages: boolean | {
        exclude: string[] | undefined;
    } | undefined;
    extractLicenses: boolean | undefined;
    inlineStyleLanguage: string;
    jit: boolean;
    stats: boolean;
    polyfills: string[] | undefined;
    poll: number | undefined;
    progress: boolean;
    preserveSymlinks: boolean;
    stylePreprocessorOptions: import("./schema").StylePreprocessorOptions | undefined;
    subresourceIntegrity: boolean | undefined;
    serverEntryPoint: string | undefined;
    prerenderOptions: {
        discoverRoutes: boolean;
        routesFile: string | undefined;
    } | undefined;
    appShellOptions: {
        route: string;
    } | undefined;
    outputMode: OutputMode | undefined;
    ssrOptions: {
        entry?: undefined;
        platform?: undefined;
    } | {
        entry: string | undefined;
        platform: ExperimentalPlatform;
    } | undefined;
    verbose: boolean | undefined;
    watch: boolean | undefined;
    workspaceRoot: string;
    entryPoints: Record<string, string>;
    optimizationOptions: import("../../utils").NormalizedOptimizationOptions;
    outputOptions: NormalizedOutputOptions;
    outExtension: "js" | "mjs" | undefined;
    sourcemapOptions: import("./schema").SourceMapClass;
    tsconfig: string;
    projectRoot: string;
    assets: (import("./schema").AssetPatternClass & {
        output: string;
    })[] | undefined;
    outputNames: {
        bundles: string;
        media: string;
    };
    fileReplacements: Record<string, string> | undefined;
    globalStyles: {
        name: string;
        files: string[];
        initial: boolean;
    }[];
    globalScripts: {
        name: string;
        files: string[];
        initial: boolean;
    }[];
    serviceWorker: string | undefined;
    indexHtmlOptions: {
        input: string;
        output: string;
        insertionOrder: [string, boolean][];
        transformer: IndexHtmlTransform | undefined;
        preloadInitial: boolean;
    } | undefined;
    tailwindConfiguration: {
        file: string;
        package: string;
    } | undefined;
    postcssConfiguration: import("../../utils/postcss-configuration").PostcssConfiguration | undefined;
    i18nOptions: I18nOptions & {
        duplicateTranslationBehavior?: I18NTranslation;
        missingTranslationBehavior?: I18NTranslation;
    };
    namedChunks: boolean | undefined;
    budgets: import("./schema").Budget[] | undefined;
    publicPath: string | undefined;
    plugins: Plugin[] | undefined;
    loaderExtensions: Record<string, "file" | "base64" | "binary" | "text" | "dataurl"> | undefined;
    jsonLogs: boolean;
    colors: boolean;
    clearScreen: boolean | undefined;
    define: {
        [key: string]: string;
    } | undefined;
    partialSSRBuild: boolean;
    externalRuntimeStyles: boolean | undefined;
    instrumentForCoverage: ((filename: string) => boolean) | undefined;
    security: {
        autoCsp: {
            unsafeEval: boolean;
        } | undefined;
    };
    templateUpdates: boolean;
    incrementalResults: boolean;
    customConditions: string[] | undefined;
    frameworkVersion: string;
}>;
export declare function getLocaleBaseHref(baseHref: string | undefined, i18n: NormalizedApplicationBuildOptions['i18nOptions'], locale: string): string | undefined;
export {};
