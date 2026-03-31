/**
 * Jest target options
 */
export type Schema = {
    /**
     * Run tests using Ahead of Time compilation.
     */
    aot?: boolean;
    /**
     * Globs of files to exclude, relative to the project root.
     */
    exclude?: string[];
    /**
     * Globs of files to include, relative to project root.
     */
    include?: string[];
    /**
     * A list of polyfills to include in the build. Can be a full path for a file, relative to
     * the current workspace or module specifier. Example: 'zone.js'.
     */
    polyfills?: string[];
    /**
     * The name of the TypeScript configuration file.
     */
    tsConfig: string;
};
