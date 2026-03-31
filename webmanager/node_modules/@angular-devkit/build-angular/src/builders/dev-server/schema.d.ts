/**
 * Dev Server target options for Build Facade.
 */
export type Schema = {
    /**
     * List of hosts that are allowed to access the dev server.
     */
    allowedHosts?: string[];
    /**
     * A build builder target to serve in the format of `project:target[:configuration]`. You
     * can also pass in more than one configuration name as a comma-separated list. Example:
     * `project:target:production,staging`.
     */
    buildTarget: string;
    /**
     * Don't verify connected clients are part of allowed hosts.
     */
    disableHostCheck?: boolean;
    /**
     * Force the development server to use the 'browser-esbuild' builder when building.
     */
    forceEsbuild?: boolean;
    /**
     * Custom HTTP headers to be added to all responses.
     */
    headers?: {
        [key: string]: string;
    };
    /**
     * Enable hot module replacement.
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
     * enable prebundling, the Angular CLI cache must also be enabled. This option has no effect
     * when using the 'browser' or other Webpack-based builders.
     */
    prebundle?: PrebundleUnion;
    /**
     * Proxy configuration file. For more information, see
     * https://angular.dev/tools/cli/serve#proxying-to-a-backend-server.
     */
    proxyConfig?: string;
    /**
     * The URL that the browser client (or live-reload client, if enabled) should use to connect
     * to the development server. Use for a complex dev server setup, such as one with reverse
     * proxies. This option has no effect when using the 'application' or other esbuild-based
     * builders.
     */
    publicHost?: string;
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
 * Activate debugging inspector. This option only has an effect when 'SSR' or 'SSG' are
 * enabled.
 */
export type Inspect = boolean | string;
/**
 * Enable and control the Vite-based development server's prebundling capabilities. To
 * enable prebundling, the Angular CLI cache must also be enabled. This option has no effect
 * when using the 'browser' or other Webpack-based builders.
 */
export type PrebundleUnion = boolean | PrebundleClass;
export type PrebundleClass = {
    /**
     * List of package imports that should not be prebundled by the development server. The
     * packages will be bundled into the application code itself.
     */
    exclude: string[];
};
