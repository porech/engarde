/**
 * Creates a new library project in your Angular workspace. Libraries are reusable
 * collections of components, services, and other Angular artifacts that can be shared
 * across multiple applications. This schematic simplifies the process of generating a new
 * library with the necessary files and configurations.
 */
export type Schema = {
    /**
     * The path to the library's public API file, relative to the workspace root. This file
     * defines what parts of the library are accessible to applications that import it.
     */
    entryFile?: string;
    /**
     * The name for the new library. This name will be used for the project directory and
     * various identifiers within the library's code.
     */
    name: string;
    /**
     * A prefix to be added to the selectors of components generated within this library. For
     * example, if the prefix is `my-lib` and you generate a component named `my-component`, the
     * selector will be `my-lib-my-component`.
     */
    prefix?: string;
    /**
     * The root directory for the new library, relative to the workspace root. If not specified,
     * the library will be created in a subfolder within the `projects` directory, using the
     * library's name.
     */
    projectRoot?: string;
    /**
     * Skip the automatic installation of packages. You will need to manually install the
     * dependencies later.
     */
    skipInstall?: boolean;
    /**
     * Do not automatically add dependencies to the `package.json` file.
     */
    skipPackageJson?: boolean;
    /**
     * Do not update the workspace `tsconfig.json` file to add a path mapping for the new
     * library. The path mapping is needed to use the library in an application, but can be
     * disabled here to simplify development.
     */
    skipTsConfig?: boolean;
    /**
     * Create a library that utilizes the standalone API, eliminating the need for NgModules.
     * This can simplify the structure of your library and its usage in applications.
     */
    standalone?: boolean;
};
