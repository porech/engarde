/**
 * Creates a new Angular component. Components are the basic building blocks of Angular
 * applications. Each component consists of a TypeScript class, an HTML template, and an
 * optional CSS stylesheet. Use this schematic to generate a new component in your project.
 */
export type Schema = {
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
    style?: Style;
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
export declare enum Style {
    Css = "css",
    Less = "less",
    None = "none",
    Sass = "sass",
    Scss = "scss"
}
/**
 * Sets the view encapsulation mode for the component. This determines how the component's
 * styles are scoped and applied.
 */
export declare enum ViewEncapsulation {
    Emulated = "Emulated",
    None = "None",
    ShadowDom = "ShadowDom"
}
