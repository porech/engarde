"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParallelCompilation = void 0;
const node_module_1 = require("node:module");
const node_worker_threads_1 = require("node:worker_threads");
const worker_pool_1 = require("../../../utils/worker-pool");
const angular_compilation_1 = require("./angular-compilation");
/**
 * An Angular compilation which uses a Node.js Worker thread to load and execute
 * the TypeScript and Angular compilers. This allows for longer synchronous actions
 * such as semantic and template diagnostics to be calculated in parallel to the
 * other aspects of the application bundling process. The worker thread also has
 * a separate memory pool which significantly reduces the need for adjusting the
 * main Node.js CLI process memory settings with large application code sizes.
 */
class ParallelCompilation extends angular_compilation_1.AngularCompilation {
    jit;
    browserOnlyBuild;
    #worker;
    constructor(jit, browserOnlyBuild) {
        super();
        this.jit = jit;
        this.browserOnlyBuild = browserOnlyBuild;
        // TODO: Convert to import.meta usage during ESM transition
        const localRequire = (0, node_module_1.createRequire)(__filename);
        this.#worker = new worker_pool_1.WorkerPool({
            maxThreads: 1,
            idleTimeout: Infinity,
            filename: localRequire.resolve('./parallel-worker'),
        });
    }
    initialize(tsconfig, hostOptions, compilerOptionsTransformer) {
        const stylesheetChannel = new node_worker_threads_1.MessageChannel();
        // The request identifier is required because Angular can issue multiple concurrent requests
        stylesheetChannel.port1.on('message', ({ requestId, data, containingFile, stylesheetFile, order, className }) => {
            hostOptions
                .transformStylesheet(data, containingFile, stylesheetFile, order, className)
                .then((value) => stylesheetChannel.port1.postMessage({ requestId, value }))
                .catch((error) => stylesheetChannel.port1.postMessage({ requestId, error }));
        });
        // The web worker processing is a synchronous operation and uses shared memory combined with
        // the Atomics API to block execution here until a response is received.
        const webWorkerChannel = new node_worker_threads_1.MessageChannel();
        const webWorkerSignal = new Int32Array(new SharedArrayBuffer(4));
        webWorkerChannel.port1.on('message', ({ workerFile, containingFile }) => {
            try {
                const workerCodeFile = hostOptions.processWebWorker(workerFile, containingFile);
                webWorkerChannel.port1.postMessage({ workerCodeFile });
            }
            catch (error) {
                webWorkerChannel.port1.postMessage({ error });
            }
            finally {
                Atomics.store(webWorkerSignal, 0, 1);
                Atomics.notify(webWorkerSignal, 0);
            }
        });
        // The compiler options transformation is a synchronous operation and uses shared memory combined
        // with the Atomics API to block execution here until a response is received.
        const optionsChannel = new node_worker_threads_1.MessageChannel();
        const optionsSignal = new Int32Array(new SharedArrayBuffer(4));
        optionsChannel.port1.on('message', (compilerOptions) => {
            try {
                const transformedOptions = compilerOptionsTransformer?.(compilerOptions) ?? compilerOptions;
                optionsChannel.port1.postMessage({ transformedOptions });
            }
            catch (error) {
                webWorkerChannel.port1.postMessage({ error });
            }
            finally {
                Atomics.store(optionsSignal, 0, 1);
                Atomics.notify(optionsSignal, 0);
            }
        });
        // Execute the initialize function in the worker thread
        return this.#worker.run({
            fileReplacements: hostOptions.fileReplacements,
            tsconfig,
            jit: this.jit,
            browserOnlyBuild: this.browserOnlyBuild,
            stylesheetPort: stylesheetChannel.port2,
            optionsPort: optionsChannel.port2,
            optionsSignal,
            webWorkerPort: webWorkerChannel.port2,
            webWorkerSignal,
        }, {
            name: 'initialize',
            transferList: [stylesheetChannel.port2, optionsChannel.port2, webWorkerChannel.port2],
        });
    }
    /**
     * This is not needed with this compilation type since the worker will already send a response
     * with the serializable esbuild compatible diagnostics.
     */
    collectDiagnostics() {
        throw new Error('Not implemented in ParallelCompilation.');
    }
    diagnoseFiles(modes = angular_compilation_1.DiagnosticModes.All) {
        return this.#worker.run(modes, { name: 'diagnose' });
    }
    emitAffectedFiles() {
        return this.#worker.run(undefined, { name: 'emit' });
    }
    update(files) {
        return this.#worker.run(files, { name: 'update' });
    }
    close() {
        return this.#worker.destroy();
    }
}
exports.ParallelCompilation = ParallelCompilation;
