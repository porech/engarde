/**
 * Dev Server target options for Build Facade.
 */
export type Schema = {
    /**
     * The hosts that the development server will respond to. This option sets the Vite option
     * of the same name. For further details:
     * https://vite.dev/config/server-options.html#server-allowedhosts
     */
    allowedHosts?: AllowedHosts;
    /**
     * A build builder target to serve in the format of `project:target[:configuration]`. You
     * can also pass in more than one configuration name as a comma-separated list. Example:
     * `project:target:production,staging`.
     */
    buildTarget: string;
    /**
     * Custom HTTP headers to be added to all responses.
     */
    headers?: {
        [key: string]: string;
    };
    /**
     * Enable hot module replacement. Defaults to the value of 'liveReload'. Currently, only
     * global and component stylesheets are supported.
     */
    hmr?: boolean;
    /**
     * Host to listen on.
     */
    host?: string;
    /**
     * Activate debugging inspector. This option only has an effect when 'SSR' or 'SSG' are
     * enabled.
     */
    inspect?: Inspect;
    /**
     * Whether to reload the page on change, using live-reload.
     */
    liveReload?: boolean;
    /**
     * Opens the url in default browser.
     */
    open?: boolean;
    /**
     * Enable and define the file watching poll time period in milliseconds.
     */
    poll?: number;
    /**
     * Port to listen on.
     */
    port?: number;
    /**
     * Enable and control the Vite-based development server's prebundling capabilities. To
     * enable prebundling, the Angular CLI cache must also be enabled.
     */
    prebundle?: PrebundleUnion;
    /**
     * Proxy configuration file. For more information, see
     * https://angular.dev/tools/cli/serve#proxying-to-a-backend-server.
     */
    proxyConfig?: string;
    /**
     * The pathname where the application will be served.
     */
    servePath?: string;
    /**
     * Serve using HTTPS.
     */
    ssl?: boolean;
    /**
     * SSL certificate to use for serving HTTPS.
     */
    sslCert?: string;
    /**
     * SSL key to use for serving HTTPS.
     */
    sslKey?: string;
    /**
     * Adds more details to output logging.
     */
    verbose?: boolean;
    /**
     * Rebuild on change.
     */
    watch?: boolean;
};
/**
 * The hosts that the development server will respond to. This option sets the Vite option
 * of the same name. For further details:
 * https://vite.dev/config/server-options.html#server-allowedhosts
 */
export type AllowedHosts = string[] | boolean;
/**
 * Activate debugging inspector. This option only has an effect when 'SSR' or 'SSG' are
 * enabled.
 */
export type Inspect = boolean | string;
/**
 * Enable and control the Vite-based development server's prebundling capabilities. To
 * enable prebundling, the Angular CLI cache must also be enabled.
 */
export type PrebundleUnion = boolean | PrebundleClass;
export type PrebundleClass = {
    /**
     * List of package imports that should not be prebundled by the development server. The
     * packages will be bundled into the application code itself. Note: specifying `@foo/bar`
     * marks all paths within the `@foo/bar` package as excluded, including sub-paths like
     * `@foo/bar/baz`.
     */
    exclude: string[];
};
