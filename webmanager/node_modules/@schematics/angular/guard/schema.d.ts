/**
 * Creates a new route guard in your project. Route guards are used to control access to
 * parts of your application by checking certain conditions before a route is activated.
 * This schematic generates a new guard with the specified name, type, and options.
 */
export type Schema = {
    /**
     * Creates the new guard files at the top level of the current project. If set to false, a
     * new folder with the guard's name will be created to contain the files.
     */
    flat?: boolean;
    /**
     * Generate the guard as a function instead of a class. Functional guards can be simpler for
     * basic scenarios.
     */
    functional?: boolean;
    /**
     * Specifies the type(s) of guard to create. You can choose one or more of the following:
     * `CanActivate` (controls access to a route), `CanActivateChild` (controls access to child
     * routes), `CanDeactivate` (asks for confirmation before leaving a route), `CanMatch`
     * (determines if a route can be matched).
     */
    implements?: Implement[];
    /**
     * The name for the new route guard. This will be used to create the guard's class and spec
     * files (e.g., `my-guard.guard.ts` and `my-guard.guard.spec.ts`).
     */
    name: string;
    /**
     * The path where the guard files should be created, relative to the current workspace. If
     * not provided, the guard will be created in the current directory.
     */
    path?: string;
    /**
     * The name of the project where the guard should be created. If not specified, the CLI will
     * determine the project from the current directory.
     */
    project: string;
    /**
     * Skip the generation of a unit test file `spec.ts` for the new guard.
     */
    skipTests?: boolean;
    /**
     * The separator character to use before the type within the generated file's name. For
     * example, if you set the option to `.`, the file will be named `example.guard.ts`.
     */
    typeSeparator?: TypeSeparator;
};
export declare enum Implement {
    CanActivate = "CanActivate",
    CanActivateChild = "CanActivateChild",
    CanDeactivate = "CanDeactivate",
    CanMatch = "CanMatch"
}
/**
 * The separator character to use before the type within the generated file's name. For
 * example, if you set the option to `.`, the file will be named `example.guard.ts`.
 */
export declare enum TypeSeparator {
    Empty = "-",
    TypeSeparator = "."
}
