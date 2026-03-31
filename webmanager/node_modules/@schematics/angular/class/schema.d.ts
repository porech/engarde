/**
 * Creates a new class in your project. Classes are the fundamental building blocks for
 * object-oriented programming in TypeScript. They provide a blueprint for creating objects
 * with properties and methods. This schematic helps you generate a new class with the basic
 * structure and optional test files.
 */
export type Schema = {
    /**
     * The name for the new class. This will be used to create the class file (e.g.,
     * `my-class.ts`) and, if enabled, the corresponding test file `my-class.spec.ts`.
     */
    name: string;
    /**
     * The path where the class file should be created, relative to the workspace root. If not
     * specified, the class will be created in the current directory.
     */
    path?: string;
    /**
     * The name of the project where the class should be added. If not specified, the CLI will
     * determine the project from the current directory.
     */
    project: string;
    /**
     * Skip the generation of a unit test file `spec.ts` for the new class.
     */
    skipTests?: boolean;
    /**
     * Adds a custom type to the filename, allowing you to create more descriptive class names.
     * For example, if you set the type to `helper`, the filename will be `my-class.helper.ts`.
     */
    type?: string;
};
