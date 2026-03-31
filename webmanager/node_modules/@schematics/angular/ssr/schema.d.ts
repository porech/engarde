/**
 * Enables Server-Side Rendering (SSR) for your Angular application. SSR allows your app to
 * be rendered on the server, which can significantly improve its initial load performance
 * and Search Engine Optimization (SEO). This schematic configures your project for SSR,
 * generating the necessary files and making the required modifications to your project's
 * structure.
 */
export type Schema = {
    /**
     * The name of the project you want to enable SSR for.
     */
    project: string;
    /**
     * Skip the automatic installation of packages. You will need to manually install the
     * dependencies later.
     */
    skipInstall?: boolean;
};
