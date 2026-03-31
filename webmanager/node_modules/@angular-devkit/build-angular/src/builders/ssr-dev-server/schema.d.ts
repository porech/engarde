/**
 * SSR Dev Server target options for Build Facade.
 */
export type Schema = {
    /**
     * Browser target to build.
     */
    browserTarget: string;
    /**
     * Host to listen on.
     */
    host?: string;
    /**
     * Launch the development server in inspector mode and listen on address and port
     * '127.0.0.1:9229'.
     */
    inspect?: boolean;
    /**
     * Opens the url in default browser.
     */
    open?: boolean;
    /**
     * Port to start the development server at. Default is 4200. Pass 0 to get a dynamically
     * assigned port.
     */
    port?: number;
    /**
     * Log progress to the console while building.
     */
    progress?: boolean;
    /**
     * Proxy configuration file.
     */
    proxyConfig?: string;
    /**
     * The URL that the browser client should use to connect to the development server. Use for
     * a complex dev server setup, such as one with reverse proxies.
     */
    publicHost?: string;
    /**
     * Server target to build.
     */
    serverTarget: string;
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
