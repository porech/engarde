/**
 * Creates a new directive in your project. Directives are used to extend the behavior or
 * appearance of HTML elements and components. They allow you to manipulate the DOM, add
 * custom attributes, and respond to events. This schematic generates the necessary files
 * and boilerplate code for a new directive.
 */
export type Schema = {
    /**
     * Automatically export the directive from the specified NgModule, making it accessible to
     * other modules in the application.
     */
    export?: boolean;
    /**
     * Creates the new directive files at the top level of the current project. If set to false,
     * a new folder with the directive's name will be created to contain the files.
     */
    flat?: boolean;
    /**
     * Specify the NgModule where the directive should be declared. If not provided, the CLI
     * will attempt to find the closest NgModule in the directive's path.
     */
    module?: string;
    /**
     * The name for the new directive. This will be used to create the directive's class and
     * spec files (e.g., `my-directive.directive.ts` and `my-directive.directive.spec.ts`).
     */
    name: string;
    /**
     * The path where the directive files should be created, relative to the workspace root. If
     * not provided, the directive will be created in the current directory.
     */
    path?: string;
    /**
     * A prefix to be added to the directive's selector. For example, if the prefix is `app` and
     * the directive name is `highlight`, the selector will be `appHighlight`.
     */
    prefix?: string;
    /**
     * The name of the project where the directive should be added. If not specified, the CLI
     * will determine the project from the current directory.
     */
    project: string;
    /**
     * The HTML selector to use for this directive. If not provided, a selector will be
     * generated based on the directive's name (e.g., `appHighlight`).
     */
    selector?: string;
    /**
     * Do not automatically import the new directive into its closest NgModule.
     */
    skipImport?: boolean;
    /**
     * Skip the generation of a unit test file `spec.ts` for the new directive.
     */
    skipTests?: boolean;
    /**
     * Generate a standalone directive. Standalone directives are self-contained and don't need
     * to be declared in an NgModule. They can be used independently or imported directly into
     * other standalone components or directives.
     */
    standalone?: boolean;
    /**
     * Append a custom type to the directive's filename. For example, if you set the type to
     * `directive`, the file will be named `example.directive.ts`.
     */
    type?: string;
};
