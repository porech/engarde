/**
 * Creates a new Angular workspace and an initial project. This schematic sets up the
 * foundation for your Angular development, generating the workspace configuration files and
 * an optional starter application. You can customize various aspects of the workspace and
 * the initial project, such as routing, styling, and testing.
 */
export type Schema = {
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
    style?: Style;
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
 * The type of stylesheet files to be created for components in the initial project.
 */
export declare enum Style {
    Css = "css",
    Less = "less",
    Sass = "sass",
    Scss = "scss"
}
/**
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
