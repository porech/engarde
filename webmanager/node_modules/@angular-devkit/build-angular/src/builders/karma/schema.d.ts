/**
 * Karma target options for Build Facade.
 */
export type Schema = {
    /**
     * Run tests using Ahead of Time compilation.
     */
    aot?: boolean;
    /**
     * List of static application assets.
     */
    assets?: AssetPattern[];
    /**
     * Override which browsers tests are run against. Set to `false` to not use any browser.
     */
    browsers?: Browsers;
    /**
     * Determines how to build the code under test. If set to 'detect', attempts to follow the
     * development builder.
     */
    builderMode?: BuilderMode;
    /**
     * Output a code coverage report.
     */
    codeCoverage?: boolean;
    /**
     * Globs to exclude from code coverage.
     */
    codeCoverageExclude?: string[];
    /**
     * Globs of files to exclude, relative to the project root.
     */
    exclude?: string[];
    /**
     * Replace compilation source files with other compilation source files in the build.
     */
    fileReplacements?: FileReplacement[];
    /**
     * Globs of files to include, relative to project root.
     * There are 2 special cases:
     * - when a path to directory is provided, all spec files ending ".spec.@(ts|tsx)" will be
     * included
     * - when a path to a file is provided, and a matching spec file exists it will be included
     * instead.
     */
    include?: string[];
    /**
     * The stylesheet language to use for the application's inline component styles.
     */
    inlineStyleLanguage?: InlineStyleLanguage;
    /**
     * The name of the Karma configuration file.
     */
    karmaConfig?: string;
    /**
     * The name of the main entry-point file.
     */
    main?: string;
    /**
     * Enable and define the file watching poll time period in milliseconds.
     */
    poll?: number;
    /**
     * Polyfills to be included in the build.
     */
    polyfills?: Polyfills;
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
     * Karma reporters to use. Directly passed to the karma runner.
     */
    reporters?: string[];
    /**
     * Global scripts to be included in the build.
     */
    scripts?: ScriptElement[];
    /**
     * Output source maps for scripts and styles. For more information, see
     * https://angular.dev/reference/configs/workspace-config#source-map-configuration.
     */
    sourceMap?: SourceMapUnion;
    /**
     * Options to pass to style preprocessors
     */
    stylePreprocessorOptions?: StylePreprocessorOptions;
    /**
     * Global styles to be included in the build.
     */
    styles?: StyleElement[];
    /**
     * The name of the TypeScript configuration file.
     */
    tsConfig: string;
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
/**
 * Override which browsers tests are run against. Set to `false` to not use any browser.
 */
export type Browsers = boolean | string;
/**
 * Determines how to build the code under test. If set to 'detect', attempts to follow the
 * development builder.
 */
export declare enum BuilderMode {
    Application = "application",
    Browser = "browser",
    Detect = "detect"
}
export type FileReplacement = {
    replace?: string;
    replaceWith?: string;
    src?: string;
    with?: string;
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
 * Polyfills to be included in the build.
 */
export type Polyfills = string[] | string;
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
 * Output source maps for scripts and styles. For more information, see
 * https://angular.dev/reference/configs/workspace-config#source-map-configuration.
 */
export type SourceMapUnion = boolean | SourceMapClass;
export type SourceMapClass = {
    /**
     * Output source maps for all scripts.
     */
    scripts?: boolean;
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
 * Options to pass to style preprocessors
 */
export type StylePreprocessorOptions = {
    /**
     * Paths to include. Paths will be resolved to workspace root.
     */
    includePaths?: string[];
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
