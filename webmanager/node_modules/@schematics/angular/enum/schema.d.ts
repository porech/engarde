/**
 * Creates a new enum in your project. Enums (enumerations) are a way to define a set of
 * named constants, making your code more readable and maintainable. This schematic
 * generates a new enum with the specified name and type.
 */
export type Schema = {
    /**
     * The name for the new enum. This will be used to create the enum file (e.g.,
     * `my-enum.enum.ts`).
     */
    name: string;
    /**
     * The path where the enum file should be created, relative to the current workspace. If not
     * specified, the enum will be created in the current directory.
     */
    path?: string;
    /**
     * The name of the project where the enum should be created. If not specified, the CLI will
     * determine the project from the current directory.
     */
    project: string;
    /**
     * Adds a custom type to the filename, allowing you to create more descriptive enum names.
     * For example, if you set the type to `status`, the filename will be `my-enum.status.ts`.
     */
    type?: string;
};
