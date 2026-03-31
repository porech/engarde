/**
 * Unit testing options for Angular applications.
 */
export type Schema = {
    /**
     * A list of browsers to use for test execution. If undefined, jsdom on Node.js will be used
     * instead of a browser. For Vitest and Karma, browser names ending with 'Headless' (e.g.,
     * 'ChromeHeadless') will enable headless mode for that browser.
     */
    browsers?: string[];
    /**
     * A build builder target to serve in the format of `project:target[:configuration]`. You
     * can also pass in more than one configuration name as a comma-separated list. Example:
     * `project:target:production,staging`.
     */
    buildTarget: string;
    /**
     * Output a code coverage report.
     */
    codeCoverage?: boolean;
    /**
     * Globs to exclude from code coverage.
     */
    codeCoverageExclude?: string[];
    /**
     * Reporters to use for code coverage results.
     */
    codeCoverageReporters?: SchemaCodeCoverageReporter[];
    /**
     * Initialize the test runner to support using the Node Inspector for test debugging.
     */
    debug?: boolean;
    /**
     * Globs of files to exclude, relative to the project root.
     */
    exclude?: string[];
    /**
     * Globs of files to include, relative to project root.
     * There are 2 special cases:
     * - when a path to directory is provided, all spec files ending ".spec.@(ts|tsx)" will be
     * included
     * - when a path to a file is provided, and a matching spec file exists it will be included
     * instead.
     */
    include?: string[];
    /**
     * TypeScript file that exports an array of Angular providers to use during test execution.
     * The array must be a default export.
     */
    providersFile?: string;
    /**
     * Test runner reporters to use. Directly passed to the test runner.
     */
    reporters?: string[];
    /**
     * The name of the test runner to use for test execution.
     */
    runner: Runner;
    /**
     * A list of global setup and configuration files that are included before the test files.
     * The application's polyfills are always included before these files. The Angular Testbed
     * is also initialized prior to the execution of these files.
     */
    setupFiles?: string[];
    /**
     * The name of the TypeScript configuration file.
     */
    tsConfig: string;
    /**
     * Re-run tests when source files change. Defaults to `true` in TTY environments and `false`
     * otherwise.
     */
    watch?: boolean;
};
export type SchemaCodeCoverageReporter = CodeCoverageReporterCodeCoverageReporter[] | CoverageReporters;
export type CodeCoverageReporterCodeCoverageReporter = CoverageReporters | {
    [key: string]: any;
};
export declare enum CoverageReporters {
    Cobertura = "cobertura",
    Html = "html",
    Json = "json",
    JsonSummary = "json-summary",
    Lcov = "lcov",
    Lcovonly = "lcovonly",
    Text = "text",
    TextSummary = "text-summary"
}
/**
 * The name of the test runner to use for test execution.
 */
export declare enum Runner {
    Karma = "karma",
    Vitest = "vitest"
}
