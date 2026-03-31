/**
 * Creates a new pipe in your project. Pipes are used to transform data for display in
 * templates. They take input values and apply a specific transformation, such as formatting
 * dates, currency, or filtering arrays. This schematic generates the necessary files and
 * boilerplate code for a new pipe.
 */
export type Schema = {
    /**
     * Automatically export the pipe from the specified NgModule, making it accessible to other
     * modules in the application.
     */
    export?: boolean;
    /**
     * Creates the new pipe files at the top level of the current project. If set to false, a
     * new folder with the pipe's name will be created to contain the files.
     */
    flat?: boolean;
    /**
     * Specify the NgModule where the pipe should be declared. If not provided, the CLI will
     * attempt to find the closest NgModule in the pipe's path.
     */
    module?: string;
    /**
     * The name for the new pipe. This will be used to create the pipe's class and spec files
     * (e.g., `my-pipe.pipe.ts` and `my-pipe.pipe.spec.ts`).
     */
    name: string;
    /**
     * The path where the pipe files should be created, relative to the workspace root. If not
     * provided, the pipe will be created in the current directory.
     */
    path?: string;
    /**
     * The name of the project where the pipe should be created. If not specified, the CLI will
     * determine the project from the current directory.
     */
    project: string;
    /**
     * Do not automatically import the new pipe into its closest NgModule.
     */
    skipImport?: boolean;
    /**
     * Prevent the generation of a unit test file `spec.ts` for the new pipe.
     */
    skipTests?: boolean;
    /**
     * Generate a standalone pipe. Standalone pipes are self-contained and don't need to be
     * declared in an NgModule. They can be used independently or imported directly into other
     * standalone components, directives, or pipes.
     */
    standalone?: boolean;
    /**
     * The separator character to use before the type within the generated file's name. For
     * example, if you set the option to `.`, the file will be named `example.pipe.ts`.
     */
    typeSeparator?: TypeSeparator;
};
/**
 * The separator character to use before the type within the generated file's name. For
 * example, if you set the option to `.`, the file will be named `example.pipe.ts`.
 */
export declare enum TypeSeparator {
    Empty = "-",
    TypeSeparator = "."
}
