/**
 * Creates a new Angular workspace. A workspace provides a structured environment for
 * developing multiple projects, allowing you to manage dependencies, configurations, and
 * build processes for a collection of applications and libraries. This schematic sets up
 * the basic structure of the workspace and installs the necessary Angular dependencies.
 */
export type Schema = {
    /**
     * Create a workspace without any testing frameworks. This is intended for learning purposes
     * and simple experimentation, not for production applications.
     */
    minimal?: boolean;
    /**
     * The name for the new workspace. This name will be used for the root directory and will be
     * referenced in various configuration files.
     */
    name: string;
    /**
     * The path where new projects will be created within the workspace, relative to the
     * workspace root. By default, new projects are created in the `projects` directory.
     */
    newProjectRoot?: string;
    /**
     * The package manager to use for installing dependencies.
     */
    packageManager?: PackageManager;
    /**
     * Enable stricter type checking and bundle budget settings for projects created within the
     * workspace. This helps improve maintainability and catch bugs early on. For more
     * information, see https://angular.dev/tools/cli/template-typecheck#strict-mode
     */
    strict?: boolean;
    /**
     * The version of the Angular CLI to use.
     */
    version: string;
};
/**
 * The package manager to use for installing dependencies.
 */
export declare enum PackageManager {
    Bun = "bun",
    Cnpm = "cnpm",
    Npm = "npm",
    Pnpm = "pnpm",
    Yarn = "yarn"
}
