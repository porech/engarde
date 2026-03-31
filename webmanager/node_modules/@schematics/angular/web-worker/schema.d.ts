/**
 * Creates a new web worker in your project. Web workers allow you to run JavaScript code in
 * the background, improving the performance and responsiveness of your application by
 * offloading computationally intensive tasks. This schematic generates the necessary files
 * for a new web worker and provides an optional code snippet to demonstrate its usage.
 */
export type Schema = {
    /**
     * The name for the new web worker. This will be used to create the worker file (e.g.,
     * `my-worker.worker.ts`).
     */
    name: string;
    /**
     * The path where the web worker file should be created, relative to the current workspace.
     * If not specified, the worker will be created in the current directory.
     */
    path?: string;
    /**
     * The name of the project where the web worker should be created. If not specified, the CLI
     * will determine the project from the current directory.
     */
    project: string;
    /**
     * Generate a code snippet that demonstrates how to create and use the new web worker.
     */
    snippet?: boolean;
};
