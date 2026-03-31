/**
 * Sets up server-side rendering (SSR) for your Angular application. SSR allows your app to
 * be rendered on the server, improving initial load performance and SEO. This schematic
 * configures your project for SSR and generates the necessary files.
 */
export type Schema = {
    /**
     * The name of the project to enable server-side rendering for.
     */
    project: string;
    /**
     * Skip the automatic installation of packages. You will need to manually install the
     * dependencies later.
     */
    skipInstall?: boolean;
};
