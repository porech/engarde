"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _DirectlyTransferable_value, _ArrayBufferViewTransferable_view, _Piscina_pool, _Piscina_histogram;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FixedQueue = exports.version = exports.queueOptionsSymbol = exports.valueSymbol = exports.transferableSymbol = exports.Piscina = exports.workerData = exports.isWorkerThread = exports.move = void 0;
const node_worker_threads_1 = require("node:worker_threads");
const node_events_1 = require("node:events");
const node_path_1 = require("node:path");
const node_util_1 = require("node:util");
const node_perf_hooks_1 = require("node:perf_hooks");
const promises_1 = require("node:timers/promises");
const package_json_1 = require("../package.json");
Object.defineProperty(exports, "version", { enumerable: true, get: function () { return package_json_1.version; } });
const symbols_1 = require("./symbols");
Object.defineProperty(exports, "queueOptionsSymbol", { enumerable: true, get: function () { return symbols_1.kQueueOptions; } });
Object.defineProperty(exports, "transferableSymbol", { enumerable: true, get: function () { return symbols_1.kTransferable; } });
Object.defineProperty(exports, "valueSymbol", { enumerable: true, get: function () { return symbols_1.kValue; } });
const task_queue_1 = require("./task_queue");
Object.defineProperty(exports, "FixedQueue", { enumerable: true, get: function () { return task_queue_1.FixedQueue; } });
const worker_pool_1 = require("./worker_pool");
const abort_1 = require("./abort");
const histogram_1 = require("./histogram");
const errors_1 = require("./errors");
const common_1 = require("./common");
const cpuParallelism = (0, common_1.getAvailableParallelism)();
const kDefaultOptions = {
    filename: null,
    name: 'default',
    minThreads: Math.max(Math.floor(cpuParallelism / 2), 1),
    maxThreads: cpuParallelism * 1.5,
    idleTimeout: 0,
    maxQueue: Infinity,
    concurrentTasksPerWorker: 1,
    atomics: 'sync',
    taskQueue: new task_queue_1.ArrayTaskQueue(),
    niceIncrement: 0,
    trackUnmanagedFds: true,
    closeTimeout: 30000,
    recordTiming: true,
    workerHistogram: false
};
const kDefaultRunOptions = {
    transferList: undefined,
    filename: null,
    signal: null,
    name: null
};
const kDefaultCloseOptions = {
    force: false
};
class DirectlyTransferable {
    constructor(value) {
        _DirectlyTransferable_value.set(this, void 0);
        __classPrivateFieldSet(this, _DirectlyTransferable_value, value, "f");
    }
    get [(_DirectlyTransferable_value = new WeakMap(), symbols_1.kTransferable)]() { return __classPrivateFieldGet(this, _DirectlyTransferable_value, "f"); }
    get [symbols_1.kValue]() { return __classPrivateFieldGet(this, _DirectlyTransferable_value, "f"); }
}
class ArrayBufferViewTransferable {
    constructor(view) {
        _ArrayBufferViewTransferable_view.set(this, void 0);
        __classPrivateFieldSet(this, _ArrayBufferViewTransferable_view, view, "f");
    }
    get [(_ArrayBufferViewTransferable_view = new WeakMap(), symbols_1.kTransferable)]() { return __classPrivateFieldGet(this, _ArrayBufferViewTransferable_view, "f").buffer; }
    get [symbols_1.kValue]() { return __classPrivateFieldGet(this, _ArrayBufferViewTransferable_view, "f"); }
}
class ThreadPool {
    constructor(publicInterface, options) {
        var _a, _b, _c;
        this.skipQueue = [];
        this.completed = 0;
        this.histogram = null;
        this.start = node_perf_hooks_1.performance.now();
        this.inProcessPendingMessages = false;
        this.startingUp = false;
        this.closingUp = false;
        this.workerFailsDuringBootstrap = false;
        this.destroying = false;
        this.publicInterface = publicInterface;
        this.taskQueue = (_a = options.taskQueue) !== null && _a !== void 0 ? _a : new task_queue_1.FixedQueue();
        const filename = options.filename ? (0, common_1.maybeFileURLToPath)(options.filename) : null;
        this.options = { ...kDefaultOptions, ...options, filename, maxQueue: 0 };
        if (this.options.recordTiming) {
            this.histogram = new histogram_1.PiscinaHistogramHandler();
        }
        // The >= and <= could be > and < but this way we get 100 % coverage 🙃
        if (options.maxThreads !== undefined &&
            this.options.minThreads >= options.maxThreads) {
            this.options.minThreads = options.maxThreads;
        }
        if (options.minThreads !== undefined &&
            this.options.maxThreads <= options.minThreads) {
            this.options.maxThreads = options.minThreads;
        }
        if (options.maxQueue === 'auto') {
            this.options.maxQueue = this.options.maxThreads ** 2;
        }
        else {
            this.options.maxQueue = (_b = options.maxQueue) !== null && _b !== void 0 ? _b : kDefaultOptions.maxQueue;
        }
        this.balancer = (_c = this.options.loadBalancer) !== null && _c !== void 0 ? _c : (0, worker_pool_1.LeastBusyBalancer)({ maximumUsage: this.options.concurrentTasksPerWorker });
        this.workers = new worker_pool_1.AsynchronouslyCreatedResourcePool(this.options.concurrentTasksPerWorker);
        this.workers.onTaskDone((w) => this._onWorkerTaskDone(w));
        this.maxCapacity = this.options.maxThreads * this.options.concurrentTasksPerWorker;
        this.startingUp = true;
        this._ensureMinimumWorkers();
        this.startingUp = false;
        this._needsDrain = false;
    }
    _ensureMinimumWorkers() {
        if (this.closingUp || this.destroying) {
            return;
        }
        while (this.workers.size < this.options.minThreads) {
            this._addNewWorker();
        }
    }
    _addNewWorker() {
        if (this.closingUp)
            return;
        const pool = this;
        const worker = new node_worker_threads_1.Worker((0, node_path_1.resolve)(__dirname, 'worker.js'), {
            env: this.options.env,
            argv: this.options.argv,
            execArgv: this.options.execArgv,
            resourceLimits: this.options.resourceLimits,
            workerData: this.options.workerData,
            trackUnmanagedFds: this.options.trackUnmanagedFds
        });
        const { port1, port2 } = new node_worker_threads_1.MessageChannel();
        const workerInfo = new worker_pool_1.WorkerInfo(worker, port1, onMessage, this.options.workerHistogram);
        workerInfo.onDestroy(() => {
            this.publicInterface.emit('workerDestroy', workerInfo.interface);
        });
        if (this.startingUp) {
            // There is no point in waiting for the initial set of Workers to indicate
            // that they are ready, we just mark them as such from the start.
            workerInfo.markAsReady();
            // We need to emit the event in the next microtask, so that the user can
            // attach event listeners before the event is emitted.
            queueMicrotask(() => {
                this.publicInterface.emit('workerCreate', workerInfo.interface);
                this._onWorkerReady(workerInfo);
            });
        }
        else {
            workerInfo.onReady(() => {
                this.publicInterface.emit('workerCreate', workerInfo.interface);
                this._onWorkerReady(workerInfo);
            });
        }
        const message = {
            filename: this.options.filename,
            name: this.options.name,
            port: port2,
            sharedBuffer: workerInfo.sharedBuffer,
            atomics: this.options.atomics,
            niceIncrement: this.options.niceIncrement
        };
        worker.postMessage(message, [port2]);
        function onMessage(message) {
            const { taskId, result } = message;
            // In case of success: Call the callback that was passed to `runTask`,
            // remove the `TaskInfo` associated with the Worker, which marks it as
            // free again.
            const taskInfo = workerInfo.taskInfos.get(taskId);
            workerInfo.taskInfos.delete(taskId);
            // TODO: we can abstract the task info handling
            // right into the pool.workers.taskDone method
            pool.workers.taskDone(workerInfo);
            /* istanbul ignore if */
            if (taskInfo === undefined) {
                const err = new Error(`Unexpected message from Worker: ${(0, node_util_1.inspect)(message)}`);
                pool.publicInterface.emit('error', err);
            }
            else {
                taskInfo.done(message.error, result);
            }
            pool._processPendingMessages();
        }
        function onReady() {
            if (workerInfo.currentUsage() === 0) {
                workerInfo.unref();
            }
            if (!workerInfo.isReady()) {
                workerInfo.markAsReady();
            }
        }
        function onEventMessage(message) {
            pool.publicInterface.emit('message', message);
        }
        worker.on('message', (message) => {
            message instanceof Object && common_1.READY in message ? onReady() : onEventMessage(message);
        });
        worker.on('error', (err) => {
            this._onError(worker, workerInfo, err, false);
        });
        worker.on('exit', (exitCode) => {
            if (this.destroying) {
                return;
            }
            const err = new Error(`worker exited with code: ${exitCode}`);
            // Only error unfinished tasks on process exit, since there are legitimate
            // reasons to exit workers and we want to handle that gracefully when possible.
            this._onError(worker, workerInfo, err, true);
        });
        worker.unref();
        port1.on('close', () => {
            // The port is only closed if the Worker stops for some reason, but we
            // always .unref() the Worker itself. We want to receive e.g. 'error'
            // events on it, so we ref it once we know it's going to exit anyway.
            worker.ref();
        });
        this.workers.add(workerInfo);
    }
    _onError(worker, workerInfo, err, onlyErrorUnfinishedTasks) {
        // Work around the bug in https://github.com/nodejs/node/pull/33394
        worker.ref = () => { };
        const taskInfos = [...workerInfo.taskInfos.values()];
        workerInfo.taskInfos.clear();
        // Remove the worker from the list and potentially start a new Worker to
        // replace the current one.
        this._removeWorker(workerInfo);
        if (workerInfo.isReady() && !this.workerFailsDuringBootstrap) {
            this._ensureMinimumWorkers();
        }
        else {
            // Do not start new workers over and over if they already fail during
            // bootstrap, there's no point.
            this.workerFailsDuringBootstrap = true;
        }
        if (taskInfos.length > 0) {
            // If there are remaining unfinished tasks, call the callback that was
            // passed to `postTask` with the error
            for (const taskInfo of taskInfos) {
                taskInfo.done(err, null);
            }
        }
        else if (!onlyErrorUnfinishedTasks) {
            // If there are no unfinished tasks, instead emit an 'error' event
            this.publicInterface.emit('error', err);
        }
    }
    _processPendingMessages() {
        if (this.inProcessPendingMessages || this.options.atomics === 'disabled') {
            return;
        }
        this.inProcessPendingMessages = true;
        try {
            for (const workerInfo of this.workers) {
                workerInfo.processPendingMessages();
            }
        }
        finally {
            this.inProcessPendingMessages = false;
        }
    }
    _removeWorker(workerInfo) {
        workerInfo.destroy();
        this.workers.delete(workerInfo);
    }
    _onWorkerReady(workerInfo) {
        this._onWorkerAvailable(workerInfo);
    }
    _onWorkerTaskDone(workerInfo) {
        this._onWorkerAvailable(workerInfo);
    }
    _onWorkerAvailable(workerInfo) {
        let workers = null;
        while ((this.taskQueue.size > 0 || this.skipQueue.length > 0)) {
            // The skipQueue will have tasks that we previously shifted off
            // the task queue but had to skip over... we have to make sure
            // we drain that before we drain the taskQueue.
            const taskInfo = this.skipQueue.shift() ||
                this.taskQueue.shift();
            if (workers == null) {
                workers = [...this.workers].map(workerInfo => workerInfo.interface);
            }
            const distributed = this._distributeTask(taskInfo, workers);
            if (distributed) {
                // If task was distributed, we should continue to distribute more tasks
                continue;
            }
            else if (this.workers.size < this.options.maxThreads) {
                // We spawn if possible
                // TODO: scheduler will intercept this.
                this._addNewWorker();
                continue;
            }
            else {
                // If balancer states that pool is busy, we should stop trying to distribute tasks
                break;
            }
        }
        //If Infinity was sent as a parameter, we skip setting the Timeout that clears the worker
        if (this.options.idleTimeout === Infinity) {
            return;
        }
        // If more workers than minThreads, we can remove idle workers
        if (workerInfo.currentUsage() === 0 &&
            this.workers.size > this.options.minThreads) {
            workerInfo.idleTimeout = setTimeout(() => {
                if (workerInfo.currentUsage() !== 0) {
                    // Exit early - we can't safely remove the worker.
                    return;
                }
                if (this.workers.size > this.options.minThreads) {
                    this._removeWorker(workerInfo);
                }
            }, this.options.idleTimeout).unref();
        }
    }
    _distributeTask(task, workers) {
        var _a;
        // We need to verify if the task is aborted already or not
        // otherwise we might be distributing aborted tasks to workers
        if (task.aborted)
            return true;
        const candidate = this.balancer(task.interface, workers);
        // Seeking for a real worker instead of customized one
        if (candidate != null && candidate[symbols_1.kWorkerData] != null) {
            const now = node_perf_hooks_1.performance.now();
            (_a = this.histogram) === null || _a === void 0 ? void 0 : _a.recordWaitTime(now - task.created);
            task.started = now;
            candidate[symbols_1.kWorkerData].postTask(task);
            queueMicrotask(() => this._maybeDrain());
            // If candidate, let's try to distribute more tasks
            return true;
        }
        if (task.abortSignal) {
            this.skipQueue.push(task);
        }
        else {
            this.taskQueue.push(task);
        }
        return false;
    }
    runTask(task, options) {
        var _a;
        let { filename, name } = options;
        const { transferList = [] } = options;
        if (filename == null) {
            filename = this.options.filename;
        }
        if (name == null) {
            name = this.options.name;
        }
        if (typeof filename !== 'string') {
            return Promise.reject(errors_1.Errors.FilenameNotProvided());
        }
        filename = (0, common_1.maybeFileURLToPath)(filename);
        let signal;
        if (this.closingUp || this.destroying) {
            const closingUpAbortController = new AbortController();
            closingUpAbortController.abort('queue is being terminated');
            signal = closingUpAbortController.signal;
        }
        else {
            signal = (_a = options.signal) !== null && _a !== void 0 ? _a : null;
        }
        let resolve;
        let reject;
        // eslint-disable-next-line
        const ret = new Promise((res, rej) => { resolve = res; reject = rej; });
        const taskInfo = new task_queue_1.TaskInfo(task, transferList, filename, name, (err, result) => {
            var _a;
            this.completed++;
            if (taskInfo.started) {
                (_a = this.histogram) === null || _a === void 0 ? void 0 : _a.recordRunTime(node_perf_hooks_1.performance.now() - taskInfo.started);
            }
            if (err !== null) {
                reject(err);
            }
            else {
                resolve(result);
            }
            queueMicrotask(() => this._maybeDrain());
        }, signal, this.publicInterface.asyncResource.asyncId());
        if (signal !== null) {
            // If the AbortSignal has an aborted property and it's truthy,
            // reject immediately.
            if (signal.aborted) {
                reject(new abort_1.AbortError(signal.reason));
                return ret;
            }
            taskInfo.abortListener = () => {
                // Call reject() first to make sure we always reject with the AbortError
                // if the task is aborted, not with an Error from the possible
                // thread termination below.
                reject(new abort_1.AbortError(signal.reason));
                if (taskInfo.workerInfo !== null) {
                    // Already running: We cancel the Worker this is running on.
                    this._removeWorker(taskInfo.workerInfo);
                    this._ensureMinimumWorkers();
                }
                else {
                    // Not yet running: Remove it from the queue.
                    // Call should be idempotent
                    this.taskQueue.remove(taskInfo);
                }
            };
            (0, abort_1.onabort)(signal, taskInfo.abortListener);
        }
        if (this.taskQueue.size > 0) {
            const totalCapacity = this.options.maxQueue + this.pendingCapacity();
            if (this.taskQueue.size >= totalCapacity) {
                if (this.options.maxQueue === 0) {
                    reject(errors_1.Errors.NoTaskQueueAvailable());
                }
                else {
                    reject(errors_1.Errors.TaskQueueAtLimit());
                }
            }
            else {
                this.taskQueue.push(taskInfo);
            }
            queueMicrotask(() => this._maybeDrain());
            return ret;
        }
        const workers = [...this.workers.readyItems].map(workerInfo => workerInfo.interface);
        const distributed = this._distributeTask(taskInfo, workers);
        if (!distributed) {
            // We spawn if possible
            // TODO: scheduler will intercept this.
            if (this.workers.size < this.options.maxThreads) {
                this._addNewWorker();
            }
            // We reject if no task queue set and no more pending capacity.
            if (this.options.maxQueue <= 0 && this.pendingCapacity() === 0) {
                reject(errors_1.Errors.NoTaskQueueAvailable());
            }
        }
        ;
        queueMicrotask(() => this._maybeDrain());
        return ret;
    }
    pendingCapacity() {
        return this.workers.pendingItems.size *
            this.options.concurrentTasksPerWorker;
    }
    _maybeDrain() {
        /**
         * Our goal is to make it possible for user space to use the pool
         * in a way where always waiting === 0,
         * since we want to avoid creating tasks that can't execute
         * immediately in order to provide back pressure to the task source.
         */
        const { maxCapacity } = this;
        const currentUsage = this.workers.getCurrentUsage();
        if (maxCapacity === currentUsage) {
            this._needsDrain = true;
            queueMicrotask(() => this.publicInterface.emit('needsDrain'));
        }
        else if (maxCapacity > currentUsage && this._needsDrain) {
            this._needsDrain = false;
            queueMicrotask(() => this.publicInterface.emit('drain'));
        }
    }
    async destroy() {
        this.destroying = true;
        while (this.skipQueue.length > 0) {
            const taskInfo = this.skipQueue.shift();
            taskInfo.done(new Error('Terminating worker thread'));
        }
        while (this.taskQueue.size > 0) {
            const taskInfo = this.taskQueue.shift();
            taskInfo.done(new Error('Terminating worker thread'));
        }
        const exitEvents = [];
        while (this.workers.size > 0) {
            const [workerInfo] = this.workers;
            exitEvents.push((0, node_events_1.once)(workerInfo.worker, 'exit'));
            this._removeWorker(workerInfo);
        }
        try {
            await Promise.all(exitEvents);
        }
        finally {
            this.destroying = false;
        }
    }
    async close(options) {
        this.closingUp = true;
        if (options.force) {
            const skipQueueLength = this.skipQueue.length;
            for (let i = 0; i < skipQueueLength; i++) {
                const taskInfo = this.skipQueue.shift();
                if (taskInfo.workerInfo === null) {
                    taskInfo.done(new abort_1.AbortError('pool is closed'));
                }
                else {
                    this.skipQueue.push(taskInfo);
                }
            }
            const taskQueueLength = this.taskQueue.size;
            for (let i = 0; i < taskQueueLength; i++) {
                const taskInfo = this.taskQueue.shift();
                if (taskInfo.workerInfo === null) {
                    taskInfo.done(new abort_1.AbortError('pool is closed'));
                }
                else {
                    this.taskQueue.push(taskInfo);
                }
            }
        }
        const onPoolFlushed = () => new Promise((resolve) => {
            const numberOfWorkers = this.workers.size;
            if (numberOfWorkers === 0) {
                resolve();
                return;
            }
            let numberOfWorkersDone = 0;
            const checkIfWorkerIsDone = (workerInfo) => {
                if (workerInfo.taskInfos.size === 0) {
                    numberOfWorkersDone++;
                }
                if (numberOfWorkers === numberOfWorkersDone) {
                    resolve();
                }
            };
            for (const workerInfo of this.workers) {
                checkIfWorkerIsDone(workerInfo);
                this.workers.onTaskDone(checkIfWorkerIsDone);
            }
        });
        const throwOnTimeOut = async (timeout) => {
            await (0, promises_1.setTimeout)(timeout, null, { ref: false });
            throw errors_1.Errors.CloseTimeout();
        };
        try {
            await Promise.race([
                onPoolFlushed(),
                throwOnTimeOut(this.options.closeTimeout)
            ]);
        }
        catch (error) {
            this.publicInterface.emit('error', error);
        }
        finally {
            await this.destroy();
            this.publicInterface.emit('close');
            this.closingUp = false;
        }
    }
}
class Piscina extends node_events_1.EventEmitterAsyncResource {
    constructor(options = {}) {
        super({ ...options, name: 'Piscina' });
        _Piscina_pool.set(this, void 0);
        _Piscina_histogram.set(this, null);
        if (typeof options.filename !== 'string' && options.filename != null) {
            throw new TypeError('options.filename must be a string or null');
        }
        if (typeof options.name !== 'string' && options.name != null) {
            throw new TypeError('options.name must be a string or null');
        }
        if (options.minThreads !== undefined &&
            (typeof options.minThreads !== 'number' || options.minThreads < 0)) {
            throw new TypeError('options.minThreads must be a non-negative integer');
        }
        if (options.maxThreads !== undefined &&
            (typeof options.maxThreads !== 'number' || options.maxThreads < 1)) {
            throw new TypeError('options.maxThreads must be a positive integer');
        }
        if (options.minThreads !== undefined && options.maxThreads !== undefined &&
            options.minThreads > options.maxThreads) {
            throw new RangeError('options.minThreads and options.maxThreads must not conflict');
        }
        if (options.idleTimeout !== undefined &&
            (typeof options.idleTimeout !== 'number' || options.idleTimeout < 0)) {
            throw new TypeError('options.idleTimeout must be a non-negative integer');
        }
        if (options.maxQueue !== undefined &&
            options.maxQueue !== 'auto' &&
            (typeof options.maxQueue !== 'number' || options.maxQueue < 0)) {
            throw new TypeError('options.maxQueue must be a non-negative integer');
        }
        if (options.concurrentTasksPerWorker !== undefined &&
            (typeof options.concurrentTasksPerWorker !== 'number' ||
                options.concurrentTasksPerWorker < 1)) {
            throw new TypeError('options.concurrentTasksPerWorker must be a positive integer');
        }
        if (options.atomics != null && (typeof options.atomics !== 'string' ||
            !['sync', 'async', 'disabled'].includes(options.atomics))) {
            throw new TypeError('options.atomics should be a value of sync, sync or disabled.');
        }
        if (options.resourceLimits !== undefined &&
            (typeof options.resourceLimits !== 'object' ||
                options.resourceLimits === null)) {
            throw new TypeError('options.resourceLimits must be an object');
        }
        if (options.taskQueue !== undefined && !(0, task_queue_1.isTaskQueue)(options.taskQueue)) {
            throw new TypeError('options.taskQueue must be a TaskQueue object');
        }
        if (options.niceIncrement !== undefined &&
            (typeof options.niceIncrement !== 'number' || (options.niceIncrement < 0 && process.platform !== 'win32'))) {
            throw new TypeError('options.niceIncrement must be a non-negative integer on Unix systems');
        }
        if (options.trackUnmanagedFds !== undefined &&
            typeof options.trackUnmanagedFds !== 'boolean') {
            throw new TypeError('options.trackUnmanagedFds must be a boolean value');
        }
        if (options.closeTimeout !== undefined && (typeof options.closeTimeout !== 'number' || options.closeTimeout < 0)) {
            throw new TypeError('options.closeTimeout must be a non-negative integer');
        }
        if (options.loadBalancer !== undefined && (typeof options.loadBalancer !== 'function' || options.loadBalancer.length < 1)) {
            throw new TypeError('options.loadBalancer must be a function with at least two args');
        }
        if (options.workerHistogram !== undefined && (typeof options.workerHistogram !== 'boolean')) {
            throw new TypeError('options.workerHistogram must be a boolean');
        }
        __classPrivateFieldSet(this, _Piscina_pool, new ThreadPool(this, options), "f");
    }
    run(task, options = kDefaultRunOptions) {
        if (options === null || typeof options !== 'object') {
            return Promise.reject(new TypeError('options must be an object'));
        }
        const { transferList, filename, name, signal } = options;
        if (transferList !== undefined && !Array.isArray(transferList)) {
            return Promise.reject(new TypeError('transferList argument must be an Array'));
        }
        if (filename != null && typeof filename !== 'string') {
            return Promise.reject(new TypeError('filename argument must be a string'));
        }
        if (name != null && typeof name !== 'string') {
            return Promise.reject(new TypeError('name argument must be a string'));
        }
        if (signal != null && typeof signal !== 'object') {
            return Promise.reject(new TypeError('signal argument must be an object'));
        }
        return __classPrivateFieldGet(this, _Piscina_pool, "f").runTask(task, { transferList, filename, name, signal });
    }
    async close(options = kDefaultCloseOptions) {
        if (options === null || typeof options !== 'object') {
            throw TypeError('options must be an object');
        }
        let { force } = options;
        if (force !== undefined && typeof force !== 'boolean') {
            return Promise.reject(new TypeError('force argument must be a boolean'));
        }
        force !== null && force !== void 0 ? force : (force = kDefaultCloseOptions.force);
        return __classPrivateFieldGet(this, _Piscina_pool, "f").close({
            force
        });
    }
    destroy() {
        return __classPrivateFieldGet(this, _Piscina_pool, "f").destroy();
    }
    [(_Piscina_pool = new WeakMap(), _Piscina_histogram = new WeakMap(), Symbol.dispose)]() {
        this.close();
    }
    [Symbol.asyncDispose]() {
        return this.close();
    }
    get maxThreads() {
        return __classPrivateFieldGet(this, _Piscina_pool, "f").options.maxThreads;
    }
    get minThreads() {
        return __classPrivateFieldGet(this, _Piscina_pool, "f").options.minThreads;
    }
    get options() {
        return __classPrivateFieldGet(this, _Piscina_pool, "f").options;
    }
    get threads() {
        const ret = [];
        for (const workerInfo of __classPrivateFieldGet(this, _Piscina_pool, "f").workers) {
            ret.push(workerInfo.worker);
        }
        return ret;
    }
    get queueSize() {
        const pool = __classPrivateFieldGet(this, _Piscina_pool, "f");
        return Math.max(pool.taskQueue.size - pool.pendingCapacity(), 0);
    }
    get completed() {
        return __classPrivateFieldGet(this, _Piscina_pool, "f").completed;
    }
    get histogram() {
        if (__classPrivateFieldGet(this, _Piscina_histogram, "f") == null) {
            const piscinahistogram = {
                // @ts-expect-error
                get runTime() { var _a; return (_a = this.histogram) === null || _a === void 0 ? void 0 : _a.runTimeSummary; },
                // @ts-expect-error
                get waitTime() { var _a; return (_a = this.histogram) === null || _a === void 0 ? void 0 : _a.waitTimeSummary; },
                resetRunTime() {
                    var _a;
                    // @ts-expect-error
                    (_a = this.histogram) === null || _a === void 0 ? void 0 : _a.resetRunTime();
                },
                resetWaitTime() {
                    var _a;
                    // @ts-expect-error
                    (_a = this.histogram) === null || _a === void 0 ? void 0 : _a.resetWaitTime();
                },
            };
            Object.defineProperty(piscinahistogram, 'histogram', {
                value: __classPrivateFieldGet(this, _Piscina_pool, "f").histogram,
                writable: false,
                enumerable: false,
                configurable: false,
            });
            __classPrivateFieldSet(this, _Piscina_histogram, piscinahistogram, "f");
        }
        ;
        return __classPrivateFieldGet(this, _Piscina_histogram, "f");
    }
    get utilization() {
        if (__classPrivateFieldGet(this, _Piscina_pool, "f").histogram == null) {
            return 0;
        }
        // count is available as of Node.js v16.14.0 but not present in the types
        const count = __classPrivateFieldGet(this, _Piscina_pool, "f").histogram.runTimeCount;
        if (count === 0) {
            return 0;
        }
        // The capacity is the max compute time capacity of the
        // pool to this point in time as determined by the length
        // of time the pool has been running multiplied by the
        // maximum number of threads.
        const capacity = this.duration * __classPrivateFieldGet(this, _Piscina_pool, "f").options.maxThreads;
        const totalMeanRuntime = (__classPrivateFieldGet(this, _Piscina_pool, "f").histogram.runTimeSummary.mean / 1000) * count;
        // We calculate the appoximate pool utilization by multiplying
        // the mean run time of all tasks by the number of runtime
        // samples taken and dividing that by the capacity. The
        // theory here is that capacity represents the absolute upper
        // limit of compute time this pool could ever attain (but
        // never will for a variety of reasons. Multiplying the
        // mean run time by the number of tasks sampled yields an
        // approximation of the realized compute time. The utilization
        // then becomes a point-in-time measure of how active the
        // pool is.
        return totalMeanRuntime / capacity;
    }
    get duration() {
        return node_perf_hooks_1.performance.now() - __classPrivateFieldGet(this, _Piscina_pool, "f").start;
    }
    get needsDrain() {
        return __classPrivateFieldGet(this, _Piscina_pool, "f")._needsDrain;
    }
    static get isWorkerThread() {
        return common_1.commonState.isWorkerThread;
    }
    static get workerData() {
        return common_1.commonState.workerData;
    }
    static get version() {
        return package_json_1.version;
    }
    static get Piscina() {
        return Piscina;
    }
    static get FixedQueue() {
        return task_queue_1.FixedQueue;
    }
    static get ArrayTaskQueue() {
        return task_queue_1.ArrayTaskQueue;
    }
    static move(val) {
        if (val != null && typeof val === 'object' && typeof val !== 'function') {
            if (!(0, common_1.isTransferable)(val)) {
                if (node_util_1.types.isArrayBufferView(val)) {
                    val = new ArrayBufferViewTransferable(val);
                }
                else {
                    val = new DirectlyTransferable(val);
                }
            }
            (0, common_1.markMovable)(val);
        }
        return val;
    }
    static get transferableSymbol() { return symbols_1.kTransferable; }
    static get valueSymbol() { return symbols_1.kValue; }
    static get queueOptionsSymbol() { return symbols_1.kQueueOptions; }
}
exports.default = Piscina;
exports.Piscina = Piscina;
exports.move = Piscina.move;
exports.isWorkerThread = Piscina.isWorkerThread;
exports.workerData = Piscina.workerData;
//# sourceMappingURL=index.js.map