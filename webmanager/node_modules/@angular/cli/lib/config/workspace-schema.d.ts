export type Schema = {
    $schema?: string;
    cli?: CliOptions;
    /**
     * Path where new projects will be created.
     */
    newProjectRoot?: string;
    projects?: Projects;
    schematics?: SchematicOptions;
    version: number;
};
export type CliOptions = {
    /**
     * Share pseudonymous usage data with the Angular Team at Google.
     */
    analytics?: Analytics;
    /**
     * Control disk cache.
     */
    cache?: Cache;
    /**
     * Specify which package manager tool to use.
     */
    packageManager?: PackageManager;
    /**
     * The list of schematic collections to use.
     */
    schematicCollections?: string[];
    /**
     * Control CLI specific console warnings
     */
    warnings?: Warnings;
};
/**
 * Share pseudonymous usage data with the Angular Team at Google.
 */
export type Analytics = boolean | string;
/**
 * Control disk cache.
 */
export type Cache = {
    /**
     * Configure whether disk caching is enabled.
     */
    enabled?: boolean;
    /**
     * Configure in which environment disk cache is enabled.
     */
    environment?: Environment;
    /**
     * Cache base path.
     */
    path?: string;
};
/**
 * Configure in which environment disk cache is enabled.
 */
export declare enum Environment {
    All = "all",
    Ci = "ci",
    Local = "local"
}
/**
 * Specify which package manager tool to use.
 *
 * The package manager used to install dependencies.
 */
export declare enum PackageManager {
    Bun = "bun",
    Cnpm = "cnpm",
    Npm = "npm",
    Pnpm = "pnpm",
    Yarn = "yarn"
}
/**
 * Control CLI specific console warnings
 */
export type Warnings = {
    /**
     * Show a warning when the global version is newer than the local one.
     */
    versionMismatch?: boolean;
};
export type Projects = {};
export type SchematicOptions = {
    "@schematics/angular:application"?: AngularApplicationOptionsSchema;
    "@schematics/angular:class"?: AngularClassOptionsSchema;
    "@schematics/angular:component"?: AngularComponentOptionsSchema;
    "@schematics/angular:directive"?: AngularDirectiveOptionsSchema;
    "@schematics/angular:enum"?: AngularEnumOptionsSchema;
    "@schematics/angular:guard"?: AngularGuardOptionsSchema;
    "@schematics/angular:interceptor"?: AngularInterceptorOptionsSchema;
    "@schematics/angular:interface"?: AngularInterfaceOptionsSchema;
    "@schematics/angular:library"?: LibraryOptionsSchema;
    "@schematics/angular:ng-new"?: AngularNgNewOptionsSchema;
    "@schematics/angular:pipe"?: AngularPipeOptionsSchema;
    "@schematics/angular:resolver"?: AngularResolverOptionsSchema;
    "@schematics/angular:service"?: AngularServiceOptionsSchema;
    "@schematics/angular:web-worker"?: AngularWebWorkerOptionsSchema;
    [property: string]: any;
};
/**
 * Generates a new Angular application within your workspace. This schematic sets up the
 * foundational structure of your project, including the root component, module, and
 * configuration files. You can customize various aspects of the application, such as
 * routing, styling, and testing.
 */
export type AngularApplicationOptionsSchema = {
    /**
     * Include the styles for the root component directly within the `app.component.ts` file.
     * Only CSS styles can be included inline. By default, a separate stylesheet file (e.g.,
     * `app.component.css`) is created.
     */
    inlineStyle?: boolean;
    /**
     * Include the HTML template for the root component directly within the `app.component.ts`
     * file. By default, a separate template file (e.g., `app.component.html`) is created.
     */
    inlineTemplate?: boolean;
    /**
     * Generate a minimal project without any testing frameworks. This is intended for learning
     * purposes and simple experimentation, not for production applications.
     */
    minimal?: boolean;
    /**
     * The name for the new application. This name will be used for the project directory and
     * various identifiers throughout the application's code.
     */
    name: string;
    /**
     * A prefix to be added to the selectors of components generated within this application.
     * For example, if the prefix is `my-app` and you generate a component named `my-component`,
     * the selector will be `my-app-my-component`.
     */
    prefix?: string;
    /**
     * The directory where the new application's files will be created, relative to the
     * workspace root. If not specified, the application will be created in a subfolder within
     * the `projects` directory, using the application's name.
     */
    projectRoot?: string;
    /**
     * Generate an application with routing already configured. This sets up the necessary files
     * and modules for managing navigation between different views in your application.
     */
    routing?: boolean;
    /**
     * Skip the automatic installation of packages. You will need to manually install the
     * dependencies later.
     */
    skipInstall?: boolean;
    /**
     * Do not add dependencies to the `package.json` file.
     */
    skipPackageJson?: boolean;
    /**
     * Skip the generation of a unit test files `spec.ts`.
     */
    skipTests?: boolean;
    /**
     * Configure the application for Server-Side Rendering (SSR) and Static Site Generation
     * (SSG/Prerendering).
     */
    ssr?: boolean;
    /**
     * Create an application that utilizes the standalone API, eliminating the need for
     * NgModules. This can simplify the structure of your application.
     */
    standalone?: boolean;
    /**
     * Enable stricter bundle budget settings for the application. This helps to keep your
     * application's bundle size small and improve performance. For more information, see
     * https://angular.dev/tools/cli/template-typecheck#strict-mode
     */
    strict?: boolean;
    /**
     * The type of stylesheet files to be created for components in the application.
     */
    style?: SchematicsAngularApplicationStyle;
    /**
     * Sets the view encapsulation mode for the application's components. This determines how
     * component styles are scoped and applied.
     */
    viewEncapsulation?: ViewEncapsulation;
    /**
     * Generate an application that does not use `zone.js`.
     */
    zoneless?: boolean;
};
/**
 * The type of stylesheet files to be created for components in the application.
 *
 * The type of stylesheet files to be created for components in the initial project.
 */
export declare enum SchematicsAngularApplicationStyle {
    Css = "css",
    Less = "less",
    Sass = "sass",
    Scss = "scss"
}
/**
 * Sets the view encapsulation mode for the application's components. This determines how
 * component styles are scoped and applied.
 *
 * Sets the view encapsulation mode for the component. This determines how the component's
 * styles are scoped and applied.
 *
 * Sets the view encapsulation mode for components in the initial project. This determines
 * how component styles are scoped and applied. Options include: `Emulated` (default, styles
 * are scoped to the component), `None` (styles are global), and `ShadowDom` (styles are
 * encapsulated using Shadow DOM).
 */
export declare enum ViewEncapsulation {
    Emulated = "Emulated",
    None = "None",
    ShadowDom = "ShadowDom"
}
/**
 * Creates a new class in your project. Classes are the fundamental building blocks for
 * object-oriented programming in TypeScript. They provide a blueprint for creating objects
 * with properties and methods. This schematic helps you generate a new class with the basic
 * structure and optional test files.
 */
export type AngularClassOptionsSchema = {
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
/**
 * Creates a new Angular component. Components are the basic building blocks of Angular
 * applications. Each component consists of a TypeScript class, an HTML template, and an
 * optional CSS stylesheet. Use this schematic to generate a new component in your project.
 */
export type AngularComponentOptionsSchema = {
    /**
     * Configures the change detection strategy for the component.
     */
    changeDetection?: ChangeDetection;
    /**
     * Adds `:host { display: block; }` to the component's stylesheet, ensuring the component
     * renders as a block-level element. This is useful for layout purposes.
     */
    displayBlock?: boolean;
    /**
     * Automatically export the component from the specified NgModule, making it accessible to
     * other modules in the application.
     */
    export?: boolean;
    /**
     * Use a default export for the component in its TypeScript file instead of a named export.
     */
    exportDefault?: boolean;
    /**
     * Create the component files directly in the project's `src/app` directory instead of
     * creating a new folder for them.
     */
    flat?: boolean;
    /**
     * Include the component's styles directly in the `component.ts` file. By default, a
     * separate stylesheet file (e.g., `my-component.css`) is created.
     */
    inlineStyle?: boolean;
    /**
     * Include the component's HTML template directly in the `component.ts` file. By default, a
     * separate template file (e.g., `my-component.html`) is created.
     */
    inlineTemplate?: boolean;
    /**
     * Specify the NgModule where the component should be declared. If not provided, the CLI
     * will attempt to find the closest NgModule in the component's path.
     */
    module?: string;
    /**
     * The name for the new component. This will be used to create the component's class,
     * template, and stylesheet files. For example, if you provide `my-component`, the files
     * will be named `my-component.ts`, `my-component.html`, and `my-component.css`.
     */
    name: string;
    /**
     * Generate component template files with an '.ng.html' file extension instead of '.html'.
     */
    ngHtml?: boolean;
    /**
     * The path where the component files should be created, relative to the current workspace.
     * If not provided, a folder with the same name as the component will be created in the
     * project's `src/app` directory.
     */
    path?: string;
    /**
     * A prefix to be added to the component's selector. For example, if the prefix is `app` and
     * the component name is `my-component`, the selector will be `app-my-component`.
     */
    prefix?: string;
    /**
     * The name of the project where the component should be added. If not specified, the CLI
     * will determine the project from the current directory.
     */
    project: string;
    /**
     * The HTML selector to use for this component. If not provided, a selector will be
     * generated based on the component name (e.g., `app-my-component`).
     */
    selector?: string;
    /**
     * Do not automatically import the new component into its closest NgModule.
     */
    skipImport?: boolean;
    /**
     * Skip the generation of an HTML selector for the component.
     */
    skipSelector?: boolean;
    /**
     * Skip the generation of unit test files `spec.ts`.
     */
    skipTests?: boolean;
    /**
     * Generate a standalone component. Standalone components are self-contained and don't need
     * to be declared in an NgModule. They can be used independently or imported directly into
     * other standalone components.
     */
    standalone?: boolean;
    /**
     * Specify the type of stylesheet to be created for the component, or `none` to skip
     * creating a stylesheet.
     */
    style?: SchematicsAngularComponentStyle;
    /**
     * Append a custom type to the component's filename. For example, if you set the type to
     * `container`, the file will be named `my-component.container.ts`.
     */
    type?: string;
    /**
     * Sets the view encapsulation mode for the component. This determines how the component's
     * styles are scoped and applied.
     */
    viewEncapsulation?: ViewEncapsulation;
};
/**
 * Configures the change detection strategy for the component.
 */
export declare enum ChangeDetection {
    Default = "Default",
    OnPush = "OnPush"
}
/**
 * Specify the type of stylesheet to be created for the component, or `none` to skip
 * creating a stylesheet.
 */
export declare enum SchematicsAngularComponentStyle {
    Css = "css",
    Less = "less",
    None = "none",
    Sass = "sass",
    Scss = "scss"
}
/**
 * Creates a new directive in your project. Directives are used to extend the behavior or
 * appearance of HTML elements and components. They allow you to manipulate the DOM, add
 * custom attributes, and respond to events. This schematic generates the necessary files
 * and boilerplate code for a new directive.
 */
export type AngularDirectiveOptionsSchema = {
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
/**
 * Creates a new enum in your project. Enums (enumerations) are a way to define a set of
 * named constants, making your code more readable and maintainable. This schematic
 * generates a new enum with the specified name and type.
 */
export type AngularEnumOptionsSchema = {
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
/**
 * Creates a new route guard in your project. Route guards are used to control access to
 * parts of your application by checking certain conditions before a route is activated.
 * This schematic generates a new guard with the specified name, type, and options.
 */
export type AngularGuardOptionsSchema = {
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
 *
 * The separator character to use before the type within the generated file's name. For
 * example, if you set the option to `.`, the file will be named `example.interceptor.ts`.
 *
 * The separator character to use before the type within the generated file's name. For
 * example, if you set the option to `.`, the file will be named `example.pipe.ts`.
 *
 * The separator character to use before the type within the generated file's name. For
 * example, if you set the option to `.`, the file will be named `example.resolver.ts`.
 */
export declare enum TypeSeparator {
    Empty = "-",
    TypeSeparator = "."
}
/**
 * Creates a new interceptor in your project. Interceptors are used to intercept and modify
 * HTTP requests and responses before they reach their destination. This allows you to
 * perform tasks like adding authentication headers, handling errors, or logging requests.
 * This schematic generates the necessary files and boilerplate code for a new interceptor.
 */
export type AngularInterceptorOptionsSchema = {
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
 * Creates a new interface in your project. Interfaces define the structure of objects in
 * TypeScript, ensuring type safety and code clarity. This schematic generates a new
 * interface with the specified name and type.
 */
export type AngularInterfaceOptionsSchema = {
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
/**
 * Creates a new library project in your Angular workspace. Libraries are reusable
 * collections of components, services, and other Angular artifacts that can be shared
 * across multiple applications. This schematic simplifies the process of generating a new
 * library with the necessary files and configurations.
 */
export type LibraryOptionsSchema = {
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
/**
 * Creates a new Angular workspace and an initial project. This schematic sets up the
 * foundation for your Angular development, generating the workspace configuration files and
 * an optional starter application. You can customize various aspects of the workspace and
 * the initial project, such as routing, styling, and testing.
 */
export type AngularNgNewOptionsSchema = {
    /**
     * Specifies which AI tools to generate configuration files for. These file are used to
     * improve the outputs of AI tools by following the best practices.
     */
    aiConfig?: AiConfig[];
    /**
     * Configure the initial Git commit for the new repository.
     */
    commit?: CommitUnion;
    /**
     * Create a new initial application project in the new workspace. When false, creates an
     * empty workspace with no initial application. You can then use the `ng generate
     * application` command to create applications in the `projects` directory.
     */
    createApplication?: boolean;
    /**
     * The directory where the new workspace and project should be created. If not specified,
     * the workspace will be created in the current directory.
     */
    directory?: string;
    /**
     * Include the styles for the initial application's root component directly within the
     * `app.component.ts` file. By default, a separate stylesheet file (e.g.,
     * `app.component.css`) is created.
     */
    inlineStyle?: boolean;
    /**
     * Include the HTML template for the initial application's root component directly within
     * the `app.component.ts` file. By default, a separate template file (e.g.,
     * `app.component.html`) is created.
     */
    inlineTemplate?: boolean;
    /**
     * Generate a minimal Angular workspace without any testing frameworks. This is intended for
     * learning purposes and simple experimentation, not for production applications.
     */
    minimal?: boolean;
    /**
     * The name for the new workspace and the initial project. This name will be used for the
     * root directory and various identifiers throughout the project.
     */
    name: string;
    /**
     * The path where new projects will be created within the workspace, relative to the
     * workspace root. By default, new projects are created in the `projects` directory.
     */
    newProjectRoot?: string;
    /**
     * The package manager used to install dependencies.
     */
    packageManager?: PackageManager;
    /**
     * The prefix to apply to generated selectors for the initial project. For example, if the
     * prefix is `my-app` and you generate a component named `my-component`, the selector will
     * be `my-app-my-component`.
     */
    prefix?: string;
    /**
     * Enable routing in the initial application project. This sets up the necessary files and
     * modules for managing navigation between different views in your application.
     */
    routing?: boolean;
    /**
     * Do not initialize a Git repository in the new workspace. By default, a Git repository is
     * initialized to help you track changes to your project.
     */
    skipGit?: boolean;
    /**
     * Skip the automatic installation of packages. You will need to manually install the
     * dependencies later.
     */
    skipInstall?: boolean;
    /**
     * Skip the generation of unit test files `spec.ts`.
     */
    skipTests?: boolean;
    /**
     * Configure the initial application for Server-Side Rendering (SSR) and Static Site
     * Generation (SSG/Prerendering).
     */
    ssr?: boolean;
    /**
     * Creates an application based upon the standalone API, without NgModules.
     */
    standalone?: boolean;
    /**
     * Enable stricter type checking and stricter bundle budgets settings. This setting helps
     * improve maintainability and catch bugs ahead of time. For more information, see
     * https://angular.dev/tools/cli/template-typecheck#strict-mode
     */
    strict?: boolean;
    /**
     * The type of stylesheet files to be created for components in the initial project.
     */
    style?: SchematicsAngularApplicationStyle;
    /**
     * The version of the Angular CLI to use.
     */
    version: string;
    /**
     * Sets the view encapsulation mode for components in the initial project. This determines
     * how component styles are scoped and applied. Options include: `Emulated` (default, styles
     * are scoped to the component), `None` (styles are global), and `ShadowDom` (styles are
     * encapsulated using Shadow DOM).
     */
    viewEncapsulation?: ViewEncapsulation;
    /**
     * Create an initial application that does not utilize `zone.js`.
     */
    zoneless?: boolean;
};
export declare enum AiConfig {
    Claude = "claude",
    Copilot = "copilot",
    Cursor = "cursor",
    Gemini = "gemini",
    Jetbrains = "jetbrains",
    None = "none",
    Windsurf = "windsurf"
}
/**
 * Configure the initial Git commit for the new repository.
 */
export type CommitUnion = boolean | CommitObject;
export type CommitObject = {
    email: string;
    message?: string;
    name: string;
    [property: string]: any;
};
/**
 * Creates a new pipe in your project. Pipes are used to transform data for display in
 * templates. They take input values and apply a specific transformation, such as formatting
 * dates, currency, or filtering arrays. This schematic generates the necessary files and
 * boilerplate code for a new pipe.
 */
export type AngularPipeOptionsSchema = {
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
 * Creates a new resolver in your project. Resolvers are used to pre-fetch data before a
 * route is activated, ensuring that the necessary data is available before the component is
 * displayed. This can improve the user experience by preventing delays and loading states.
 * This schematic generates a new resolver with the specified name and options.
 */
export type AngularResolverOptionsSchema = {
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
 * Creates a new service in your project. Services are used to encapsulate reusable logic,
 * such as data access, API calls, or utility functions. This schematic simplifies the
 * process of generating a new service with the necessary files and boilerplate code.
 */
export type AngularServiceOptionsSchema = {
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
/**
 * Creates a new web worker in your project. Web workers allow you to run JavaScript code in
 * the background, improving the performance and responsiveness of your application by
 * offloading computationally intensive tasks. This schematic generates the necessary files
 * for a new web worker and provides an optional code snippet to demonstrate its usage.
 */
export type AngularWebWorkerOptionsSchema = {
    /**
     * The name for the new web worker. This will be used to create the worker file (e.g.,
     * `my-worker.worker.ts`).
     */
    name: string;
    /**
     * The path where the web worker file should be created, relative to the current workspace.
     * If not specified, the worker will be created in the current directory.
     */
    path?: string;
    /**
     * The name of the project where the web worker should be created. If not specified, the CLI
     * will determine the project from the current directory.
     */
    project: string;
    /**
     * Generate a code snippet that demonstrates how to create and use the new web worker.
     */
    snippet?: boolean;
};
