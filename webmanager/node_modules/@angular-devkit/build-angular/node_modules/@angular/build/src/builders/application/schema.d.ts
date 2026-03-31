/**
 * Application builder target options
 */
export type Schema = {
    /**
     * A list of CommonJS or AMD packages that are allowed to be used without a build time
     * warning. Use `'*'` to allow all.
     */
    allowedCommonJsDependencies?: string[];
    /**
     * Build using Ahead of Time compilation.
     */
    aot?: boolean;
    /**
     * Generates an application shell during build time.
     */
    appShell?: boolean;
    /**
     * Define the assets to be copied to the output directory. These assets are copied as-is
     * without any further processing or hashing.
     */
    assets?: AssetPattern[];
    /**
     * Base url for the application being built.
     */
    baseHref?: string;
    /**
     * The full path for the browser entry point to the application, relative to the current
     * workspace.
     */
    browser?: string;
    /**
     * Budget thresholds to ensure parts of your application stay within boundaries which you
     * set.
     */
    budgets?: Budget[];
    /**
     * Automatically clear the terminal screen during rebuilds.
     */
    clearScreen?: boolean;
    /**
     * Custom package resolution conditions used to resolve conditional exports/imports.
     * Defaults to ['module', 'development'/'production']. The following special conditions are
     * always present if the requirements are satisfied: 'default', 'import', 'require',
     * 'browser', 'node'.
     */
    conditions?: string[];
    /**
     * Define the crossorigin attribute setting of elements that provide CORS support.
     */
    crossOrigin?: CrossOrigin;
    /**
     * Defines global identifiers that will be replaced with a specified constant value when
     * found in any JavaScript or TypeScript code including libraries. The value will be used
     * directly. String values must be put in quotes. Identifiers within Angular metadata such
     * as Component Decorators will not be replaced.
     */
    define?: {
        [key: string]: string;
    };
    /**
     * Delete the output path before building.
     */
    deleteOutputPath?: boolean;
    /**
     * Customize the base path for the URLs of resources in 'index.html' and component
     * stylesheets. This option is only necessary for specific deployment scenarios, such as
     * with Angular Elements or when utilizing different CDN locations.
     */
    deployUrl?: string;
    /**
     * Exclude the listed external dependencies from being bundled into the bundle. Instead, the
     * created bundle relies on these dependencies to be available during runtime. Note:
     * `@foo/bar` marks all paths within the `@foo/bar` package as external, including sub-paths
     * like `@foo/bar/baz`.
     */
    externalDependencies?: string[];
    /**
     * Extract all licenses in a separate file.
     */
    extractLicenses?: boolean;
    /**
     * Replace compilation source files with other compilation source files in the build.
     */
    fileReplacements?: FileReplacement[];
    /**
     * How to handle duplicate translations for i18n.
     */
    i18nDuplicateTranslation?: I18NTranslation;
    /**
     * How to handle missing translations for i18n.
     */
    i18nMissingTranslation?: I18NTranslation;
    /**
     * Configures the generation of the application's HTML index.
     */
    index?: IndexUnion;
    /**
     * The stylesheet language to use for the application's inline component styles.
     */
    inlineStyleLanguage?: InlineStyleLanguage;
    /**
     * Defines the type of loader to use with a specified file extension when used with a
     * JavaScript `import`. `text` inlines the content as a string; `binary` inlines the content
     * as a Uint8Array; `file` emits the file and provides the runtime location of the file;
     * `dataurl` inlines the content as a data URL with best guess of MIME type; `base64`
     * inlines the content as a Base64-encoded string; `empty` considers the content to be empty
     * and not include it in bundles.
     */
    loader?: {
        [key: string]: any;
    };
    /**
     * Translate the bundles in one or more locales.
     */
    localize?: Localize;
    /**
     * Use file name for lazy loaded chunks.
     */
    namedChunks?: boolean;
    /**
     * Enables optimization of the build output. Including minification of scripts and styles,
     * tree-shaking, dead-code elimination, inlining of critical CSS and fonts inlining. For
     * more information, see
     * https://angular.dev/reference/configs/workspace-config#optimization-configuration.
     */
    optimization?: OptimizationUnion;
    /**
     * Define the output filename cache-busting hashing mode.
     *
     * - `none`: No hashing.
     * - `all`: Hash for all output bundles.
     * - `media`: Hash for all output media (e.g., images, fonts, etc. that are referenced in
     * CSS files).
     * - `bundles`: Hash for output of lazy and main bundles.
     */
    outputHashing?: OutputHashing;
    /**
     * Defines the build output target. 'static': Generates a static site for deployment on any
     * static hosting service. 'server': Produces an application designed for deployment on a
     * server that supports server-side rendering (SSR).
     */
    outputMode?: OutputMode;
    /**
     * Specify the output path relative to workspace root.
     */
    outputPath?: OutputPathUnion;
    /**
     * Enable and define the file watching poll time period in milliseconds.
     */
    poll?: number;
    /**
     * A list of polyfills to include in the build. Can be a full path for a file, relative to
     * the current workspace or module specifier. Example: 'zone.js'.
     */
    polyfills?: string[];
    /**
     * Prerender (SSG) pages of your application during build time.
     */
    prerender?: PrerenderUnion;
    /**
     * Do not use the real path when resolving modules. If unset then will default to `true` if
     * NodeJS option --preserve-symlinks is set.
     */
    preserveSymlinks?: boolean;
    /**
     * Log progress to the console while building.
     */
    progress?: boolean;
    /**
     * Global scripts to be included in the build.
     */
    scripts?: ScriptElement[];
    /**
     * Security features to protect against XSS and other common attacks
     */
    security?: Security;
    /**
     * The full path for the server entry point to the application, relative to the current
     * workspace.
     */
    server?: Serv;
    /**
     * Generates a service worker configuration.
     */
    serviceWorker?: Serv;
    /**
     * Output source maps for scripts and styles. For more information, see
     * https://angular.dev/reference/configs/workspace-config#source-map-configuration.
     */
    sourceMap?: SourceMapUnion;
    /**
     * Server side render (SSR) pages of your application during runtime.
     */
    ssr?: SsrUnion;
    /**
     * Generates a 'stats.json' file which can be analyzed with
     * https://esbuild.github.io/analyze/.
     */
    statsJson?: boolean;
    /**
     * Options to pass to style preprocessors.
     */
    stylePreprocessorOptions?: StylePreprocessorOptions;
    /**
     * Global styles to be included in the build.
     */
    styles?: StyleElement[];
    /**
     * Enables the use of subresource integrity validation.
     */
    subresourceIntegrity?: boolean;
    /**
     * The full path for the TypeScript configuration file, relative to the current workspace.
     */
    tsConfig: string;
    /**
     * Adds more details to output logging.
     */
    verbose?: boolean;
    /**
     * Run build when files change.
     */
    watch?: boolean;
    /**
     * TypeScript configuration for Web Worker modules.
     */
    webWorkerTsConfig?: string;
};
export type AssetPattern = AssetPatternClass | string;
export type AssetPatternClass = {
    /**
     * Allow glob patterns to follow symlink directories. This allows subdirectories of the
     * symlink to be searched.
     */
    followSymlinks?: boolean;
    /**
     * The pattern to match.
     */
    glob: string;
    /**
     * An array of globs to ignore.
     */
    ignore?: string[];
    /**
     * The input directory path in which to apply 'glob'. Defaults to the project root.
     */
    input: string;
    /**
     * Absolute path within the output.
     */
    output?: string;
};
export type Budget = {
    /**
     * The baseline size for comparison.
     */
    baseline?: string;
    /**
     * The threshold for error relative to the baseline (min & max).
     */
    error?: string;
    /**
     * The maximum threshold for error relative to the baseline.
     */
    maximumError?: string;
    /**
     * The maximum threshold for warning relative to the baseline.
     */
    maximumWarning?: string;
    /**
     * The minimum threshold for error relative to the baseline.
     */
    minimumError?: string;
    /**
     * The minimum threshold for warning relative to the baseline.
     */
    minimumWarning?: string;
    /**
     * The name of the bundle.
     */
    name?: string;
    /**
     * The type of budget.
     */
    type: Type;
    /**
     * The threshold for warning relative to the baseline (min & max).
     */
    warning?: string;
};
/**
 * The type of budget.
 */
export declare enum Type {
    All = "all",
    AllScript = "allScript",
    Any = "any",
    AnyComponentStyle = "anyComponentStyle",
    AnyScript = "anyScript",
    Bundle = "bundle",
    Initial = "initial"
}
/**
 * Define the crossorigin attribute setting of elements that provide CORS support.
 */
export declare enum CrossOrigin {
    Anonymous = "anonymous",
    None = "none",
    UseCredentials = "use-credentials"
}
export type FileReplacement = {
    replace: string;
    with: string;
};
/**
 * How to handle duplicate translations for i18n.
 *
 * How to handle missing translations for i18n.
 */
export declare enum I18NTranslation {
    Error = "error",
    Ignore = "ignore",
    Warning = "warning"
}
/**
 * Configures the generation of the application's HTML index.
 */
export type IndexUnion = boolean | IndexObject | string;
export type IndexObject = {
    /**
     * The path of a file to use for the application's generated HTML index.
     */
    input: string;
    /**
     * The output path of the application's generated HTML index file. The full provided path
     * will be used and will be considered relative to the application's configured output path.
     */
    output?: string;
    /**
     * Generates 'preload', 'modulepreload', and 'preconnect' link elements for initial
     * application files and resources.
     */
    preloadInitial?: boolean;
    [property: string]: any;
};
/**
 * The stylesheet language to use for the application's inline component styles.
 */
export declare enum InlineStyleLanguage {
    Css = "css",
    Less = "less",
    Sass = "sass",
    Scss = "scss"
}
/**
 * Translate the bundles in one or more locales.
 */
export type Localize = string[] | boolean;
/**
 * Enables optimization of the build output. Including minification of scripts and styles,
 * tree-shaking, dead-code elimination, inlining of critical CSS and fonts inlining. For
 * more information, see
 * https://angular.dev/reference/configs/workspace-config#optimization-configuration.
 */
export type OptimizationUnion = boolean | OptimizationClass;
export type OptimizationClass = {
    /**
     * Enables optimization for fonts. This option requires internet access. `HTTPS_PROXY`
     * environment variable can be used to specify a proxy server.
     */
    fonts?: FontsUnion;
    /**
     * Enables optimization of the scripts output.
     */
    scripts?: boolean;
    /**
     * Enables optimization of the styles output.
     */
    styles?: StylesUnion;
};
/**
 * Enables optimization for fonts. This option requires internet access. `HTTPS_PROXY`
 * environment variable can be used to specify a proxy server.
 */
export type FontsUnion = boolean | FontsClass;
export type FontsClass = {
    /**
     * Reduce render blocking requests by inlining external Google Fonts and Adobe Fonts CSS
     * definitions in the application's HTML index file. This option requires internet access.
     * `HTTPS_PROXY` environment variable can be used to specify a proxy server.
     */
    inline?: boolean;
};
/**
 * Enables optimization of the styles output.
 */
export type StylesUnion = boolean | StylesClass;
export type StylesClass = {
    /**
     * Extract and inline critical CSS definitions to improve first paint time.
     */
    inlineCritical?: boolean;
    /**
     * Minify CSS definitions by removing extraneous whitespace and comments, merging
     * identifiers and minimizing values.
     */
    minify?: boolean;
    /**
     * Remove comments in global CSS that contains '@license' or '@preserve' or that starts with
     * '//!' or '/*!'.
     */
    removeSpecialComments?: boolean;
};
/**
 * Define the output filename cache-busting hashing mode.
 *
 * - `none`: No hashing.
 * - `all`: Hash for all output bundles.
 * - `media`: Hash for all output media (e.g., images, fonts, etc. that are referenced in
 * CSS files).
 * - `bundles`: Hash for output of lazy and main bundles.
 */
export declare enum OutputHashing {
    All = "all",
    Bundles = "bundles",
    Media = "media",
    None = "none"
}
/**
 * Defines the build output target. 'static': Generates a static site for deployment on any
 * static hosting service. 'server': Produces an application designed for deployment on a
 * server that supports server-side rendering (SSR).
 */
export declare enum OutputMode {
    Server = "server",
    Static = "static"
}
/**
 * Specify the output path relative to workspace root.
 */
export type OutputPathUnion = OutputPathClass | string;
export type OutputPathClass = {
    /**
     * Specify the output path relative to workspace root.
     */
    base: string;
    /**
     * The output directory name of your browser build within the output path base. Defaults to
     * 'browser'.
     */
    browser?: string;
    /**
     * The output directory name of your media files within the output browser directory.
     * Defaults to 'media'.
     */
    media?: string;
    /**
     * The output directory name of your server build within the output path base. Defaults to
     * 'server'.
     */
    server?: string;
};
/**
 * Prerender (SSG) pages of your application during build time.
 */
export type PrerenderUnion = boolean | PrerenderClass;
export type PrerenderClass = {
    /**
     * Whether the builder should process the Angular Router configuration to find all
     * unparameterized routes and prerender them.
     */
    discoverRoutes?: boolean;
    /**
     * The path to a file that contains a list of all routes to prerender, separated by
     * newlines. This option is useful if you want to prerender routes with parameterized URLs.
     */
    routesFile?: string;
};
export type ScriptElement = ScriptClass | string;
export type ScriptClass = {
    /**
     * The bundle name for this extra entry point.
     */
    bundleName?: string;
    /**
     * If the bundle will be referenced in the HTML file.
     */
    inject?: boolean;
    /**
     * The file to include.
     */
    input: string;
};
/**
 * Security features to protect against XSS and other common attacks
 */
export type Security = {
    /**
     * Enables automatic generation of a hash-based Strict Content Security Policy
     * (https://web.dev/articles/strict-csp#choose-hash) based on scripts in index.html. Will
     * default to true once we are out of experimental/preview phases.
     */
    autoCsp?: AutoCspUnion;
};
/**
 * Enables automatic generation of a hash-based Strict Content Security Policy
 * (https://web.dev/articles/strict-csp#choose-hash) based on scripts in index.html. Will
 * default to true once we are out of experimental/preview phases.
 */
export type AutoCspUnion = boolean | AutoCspClass;
export type AutoCspClass = {
    /**
     * Include the `unsafe-eval` directive (https://web.dev/articles/strict-csp#remove-eval) in
     * the auto-CSP. Please only enable this if you are absolutely sure that you need to, as
     * allowing calls to eval will weaken the XSS defenses provided by the auto-CSP.
     */
    unsafeEval?: boolean;
};
/**
 * The full path for the server entry point to the application, relative to the current
 * workspace.
 *
 * Generates a service worker configuration.
 */
export type Serv = boolean | string;
/**
 * Output source maps for scripts and styles. For more information, see
 * https://angular.dev/reference/configs/workspace-config#source-map-configuration.
 */
export type SourceMapUnion = boolean | SourceMapClass;
export type SourceMapClass = {
    /**
     * Output source maps used for error reporting tools.
     */
    hidden?: boolean;
    /**
     * Output source maps for all scripts.
     */
    scripts?: boolean;
    /**
     * Output original source content for files within the source map.
     */
    sourcesContent?: boolean;
    /**
     * Output source maps for all styles.
     */
    styles?: boolean;
    /**
     * Resolve vendor packages source maps.
     */
    vendor?: boolean;
};
/**
 * Server side render (SSR) pages of your application during runtime.
 */
export type SsrUnion = boolean | SsrClass;
export type SsrClass = {
    /**
     * The server entry-point that when executed will spawn the web server.
     */
    entry?: string;
    /**
     * Specifies the platform for which the server bundle is generated. This affects the APIs
     * and modules available in the server-side code.
     *
     * - `node`:  (Default) Generates a bundle optimized for Node.js environments.
     * - `neutral`: Generates a platform-neutral bundle suitable for environments like edge
     * workers, and other serverless platforms. This option avoids using Node.js-specific APIs,
     * making the bundle more portable.
     *
     * Please note that this feature does not provide polyfills for Node.js modules.
     * Additionally, it is experimental, and the schematics may undergo changes in future
     * versions.
     */
    experimentalPlatform?: ExperimentalPlatform;
};
/**
 * Specifies the platform for which the server bundle is generated. This affects the APIs
 * and modules available in the server-side code.
 *
 * - `node`:  (Default) Generates a bundle optimized for Node.js environments.
 * - `neutral`: Generates a platform-neutral bundle suitable for environments like edge
 * workers, and other serverless platforms. This option avoids using Node.js-specific APIs,
 * making the bundle more portable.
 *
 * Please note that this feature does not provide polyfills for Node.js modules.
 * Additionally, it is experimental, and the schematics may undergo changes in future
 * versions.
 */
export declare enum ExperimentalPlatform {
    Neutral = "neutral",
    Node = "node"
}
/**
 * Options to pass to style preprocessors.
 */
export type StylePreprocessorOptions = {
    /**
     * Paths to include. Paths will be resolved to workspace root.
     */
    includePaths?: string[];
    /**
     * Options to pass to the sass preprocessor.
     */
    sass?: Sass;
};
/**
 * Options to pass to the sass preprocessor.
 */
export type Sass = {
    /**
     * A set of deprecations to treat as fatal. If a deprecation warning of any provided type is
     * encountered during compilation, the compiler will error instead. If a Version is
     * provided, then all deprecations that were active in that compiler version will be treated
     * as fatal.
     */
    fatalDeprecations?: string[];
    /**
     * A set of future deprecations to opt into early. Future deprecations passed here will be
     * treated as active by the compiler, emitting warnings as necessary.
     */
    futureDeprecations?: string[];
    /**
     * A set of active deprecations to ignore. If a deprecation warning of any provided type is
     * encountered during compilation, the compiler will ignore it instead.
     */
    silenceDeprecations?: string[];
};
export type StyleElement = StyleClass | string;
export type StyleClass = {
    /**
     * The bundle name for this extra entry point.
     */
    bundleName?: string;
    /**
     * If the bundle will be referenced in the HTML file.
     */
    inject?: boolean;
    /**
     * The file to include.
     */
    input: string;
};
