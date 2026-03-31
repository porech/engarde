/**
 * Creates a new interface in your project. Interfaces define the structure of objects in
 * TypeScript, ensuring type safety and code clarity. This schematic generates a new
 * interface with the specified name and type.
 */
export type Schema = {
    /**
     * The name for the new interface. This will be used to create the interface file (e.g.,
     * `my-interface.interface.ts`).
     */
    name: string;
    /**
     * The path where the interface file should be created, relative to the workspace root. If
     * not provided, the interface will be created in the current directory.
     */
    path?: string;
    /**
     * A prefix to be added to the interface name. This is typically not used for interfaces, as
     * they don't have selectors like components or directives.
     */
    prefix?: string;
    /**
     * The name of the project where the interface should be created. If not specified, the CLI
     * will determine the project from the current directory.
     */
    project: string;
    /**
     * Adds a custom type to the filename, allowing you to create more descriptive interface
     * names. For example, if you set the type to `data`, the filename will be
     * `my-interface.data.ts`.
     */
    type?: string;
};
