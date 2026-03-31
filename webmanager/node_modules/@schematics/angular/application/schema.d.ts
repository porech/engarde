/**
 * Generates a new Angular application within your workspace. This schematic sets up the
 * foundational structure of your project, including the root component, module, and
 * configuration files. You can customize various aspects of the application, such as
 * routing, styling, and testing.
 */
export type Schema = {
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
    style?: Style;
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
 */
export declare enum Style {
    Css = "css",
    Less = "less",
    Sass = "sass",
    Scss = "scss"
}
/**
 * Sets the view encapsulation mode for the application's components. This determines how
 * component styles are scoped and applied.
 */
export declare enum ViewEncapsulation {
    Emulated = "Emulated",
    None = "None",
    ShadowDom = "ShadowDom"
}
