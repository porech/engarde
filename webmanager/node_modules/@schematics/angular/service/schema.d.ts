/**
 * Creates a new service in your project. Services are used to encapsulate reusable logic,
 * such as data access, API calls, or utility functions. This schematic simplifies the
 * process of generating a new service with the necessary files and boilerplate code.
 */
export type Schema = {
    /**
     * Creates files at the top level of the project or the given path. If set to false, a new
     * folder with the service's name will be created to contain the files.
     */
    flat?: boolean;
    /**
     * The name for the new service. This will be used to create the service's class and spec
     * files (e.g., `my-service.service.ts` and `my-service.service.spec.ts`).
     */
    name: string;
    /**
     * The path where the service files should be created, relative to the workspace root. If
     * not provided, the service will be created in the project's `src/app` directory.
     */
    path?: string;
    /**
     * The name of the project where the service should be added. If not specified, the CLI will
     * determine the project from the current directory.
     */
    project: string;
    /**
     * Skip the generation of a unit test file `spec.ts` for the service.
     */
    skipTests?: boolean;
    /**
     * Append a custom type to the service's filename. For example, if you set the type to
     * `service`, the file will be named `my-service.service.ts`.
     */
    type?: string;
};
