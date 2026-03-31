export type Schema = {
    /**
     * Target to build.
     */
    browserTarget: string;
    /**
     * Whether the builder should process the Angular Router configuration to find all
     * unparameterized routes and prerender them.
     */
    discoverRoutes?: boolean;
    /**
     * The routes to render.
     */
    routes?: string[];
    /**
     * The path to a file that contains a list of all routes to prerender, separated by
     * newlines. This option is useful if you want to prerender routes with parameterized URLs.
     */
    routesFile?: string;
    /**
     * Server target to use for prerendering the app.
     */
    serverTarget: string;
};
