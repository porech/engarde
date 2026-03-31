/**
 * Adds a service worker to your project. Service workers enable your application to work
 * offline or on low-quality networks by caching assets and intercepting network requests.
 * This schematic configures your project to use a service worker.
 */
export type Schema = {
    /**
     * The name of the project to add the service worker to. If not specified, the CLI will
     * determine the project from the current directory.
     */
    project: string;
    /**
     * The build target to apply the service worker to. This is typically `build`, indicating
     * that the service worker should be generated during the standard build process.
     */
    target?: string;
};
