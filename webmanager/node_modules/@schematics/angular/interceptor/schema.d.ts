/**
 * Creates a new interceptor in your project. Interceptors are used to intercept and modify
 * HTTP requests and responses before they reach their destination. This allows you to
 * perform tasks like adding authentication headers, handling errors, or logging requests.
 * This schematic generates the necessary files and boilerplate code for a new interceptor.
 */
export type Schema = {
    /**
     * Creates the new interceptor files at the top level of the current project. If set to
     * false, a new folder with the interceptor's name will be created to contain the files.
     */
    flat?: boolean;
    /**
     * Creates the interceptor as a function `HttpInterceptorFn` instead of a class. Functional
     * interceptors can be simpler for basic scenarios.
     */
    functional?: boolean;
    /**
     * The name for the new interceptor. This will be used to create the interceptor's class and
     * spec files (e.g., `my-interceptor.interceptor.ts` and
     * `my-interceptor.interceptor.spec.ts`).
     */
    name: string;
    /**
     * The path where the interceptor files should be created, relative to the workspace root.
     * If not provided, the interceptor will be created in the current directory.
     */
    path?: string;
    /**
     * The name of the project where the interceptor should be created. If not specified, the
     * CLI will determine the project from the current directory.
     */
    project: string;
    /**
     * Skip the generation of a unit test file `spec.ts` for the new interceptor.
     */
    skipTests?: boolean;
    /**
     * The separator character to use before the type within the generated file's name. For
     * example, if you set the option to `.`, the file will be named `example.interceptor.ts`.
     */
    typeSeparator?: TypeSeparator;
};
/**
 * The separator character to use before the type within the generated file's name. For
 * example, if you set the option to `.`, the file will be named `example.interceptor.ts`.
 */
export declare enum TypeSeparator {
    Empty = "-",
    TypeSeparator = "."
}
