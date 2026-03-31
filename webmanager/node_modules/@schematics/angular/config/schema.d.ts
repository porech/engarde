/**
 * Generates configuration files for your project. These files control various aspects of
 * your project's build process, testing, and browser compatibility. This schematic helps
 * you create or update essential configuration files with ease.
 */
export type Schema = {
    /**
     * The name of the project where the configuration file should be created or updated.
     */
    project: string;
    /**
     * Specifies the type of configuration file to generate.
     */
    type: Type;
};
/**
 * Specifies the type of configuration file to generate.
 */
export declare enum Type {
    Browserslist = "browserslist",
    Karma = "karma"
}
