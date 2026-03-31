/**
 * Creates a new resolver in your project. Resolvers are used to pre-fetch data before a
 * route is activated, ensuring that the necessary data is available before the component is
 * displayed. This can improve the user experience by preventing delays and loading states.
 * This schematic generates a new resolver with the specified name and options.
 */
export type Schema = {
    /**
     * Creates the new resolver files at the top level of the current project. If set to false,
     * a new folder with the resolver's name will be created to contain the files.
     */
    flat?: boolean;
    /**
     * Creates the resolver as a function `ResolveFn` instead of a class. Functional resolvers
     * can be simpler for basic scenarios.
     */
    functional?: boolean;
    /**
     * The name for the new resolver. This will be used to create the resolver's class and spec
     * files (e.g., `my-resolver.resolver.ts` and `my-resolver.resolver.spec.ts`).
     */
    name: string;
    /**
     * The path where the resolver files should be created, relative to the current workspace.
     * If not provided, the resolver will be created in the current directory.
     */
    path?: string;
    /**
     * The name of the project where the resolver should be created. If not specified, the CLI
     * will determine the project from the current directory.
     */
    project: string;
    /**
     * Skip the generation of a unit test file `spec.ts` for the new resolver.
     */
    skipTests?: boolean;
    /**
     * The separator character to use before the type within the generated file's name. For
     * example, if you set the option to `.`, the file will be named `example.resolver.ts`.
     */
    typeSeparator?: TypeSeparator;
};
/**
 * The separator character to use before the type within the generated file's name. For
 * example, if you set the option to `.`, the file will be named `example.resolver.ts`.
 */
export declare enum TypeSeparator {
    Empty = "-",
    TypeSeparator = "."
}
