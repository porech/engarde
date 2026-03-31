"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AsynchronouslyCreatedResourcePool = exports.WorkerInfo = void 0;
const node_worker_threads_1 = require("node:worker_threads");
const node_perf_hooks_1 = require("node:perf_hooks");
const node_assert_1 = __importDefault(require("node:assert"));
const errors_1 = require("../errors");
const symbols_1 = require("../symbols");
const histogram_1 = require("../histogram");
const base_1 = require("./base");
Object.defineProperty(exports, "AsynchronouslyCreatedResourcePool", { enumerable: true, get: function () { return base_1.AsynchronouslyCreatedResourcePool; } });
__exportStar(require("./balancer"), exports);
class WorkerInfo extends base_1.AsynchronouslyCreatedResource {
    constructor(worker, port, onMessage, enableHistogram) {
        super();
        this.idleTimeout = null;
        this.lastSeenResponseCount = 0;
        this.terminating = false;
        this.destroyed = false;
        this.worker = worker;
        this.port = port;
        this.port.on('message', (message) => this._handleResponse(message));
        this.onMessage = onMessage;
        this.taskInfos = new Map();
        this.sharedBuffer = new Int32Array(new SharedArrayBuffer(symbols_1.kFieldCount * Int32Array.BYTES_PER_ELEMENT));
        this.histogram = enableHistogram ? (0, node_perf_hooks_1.createHistogram)() : null;
    }
    get id() {
        return this.worker.threadId;
    }
    destroy() {
        if (this.terminating || this.destroyed)
            return;
        this.terminating = true;
        this.clearIdleTimeout();
        this.worker.terminate();
        this.port.close();
        for (const taskInfo of this.taskInfos.values()) {
            taskInfo.done(errors_1.Errors.ThreadTermination());
        }
        this.taskInfos.clear();
        this.terminating = false;
        this.destroyed = true;
        this.markAsDestroyed();
    }
    clearIdleTimeout() {
        if (this.idleTimeout != null) {
            clearTimeout(this.idleTimeout);
            this.idleTimeout = null;
        }
    }
    ref() {
        this.port.ref();
        return this;
    }
    unref() {
        // Note: Do not call ref()/unref() on the Worker itself since that may cause
        // a hard crash, see https://github.com/nodejs/node/pull/33394.
        this.port.unref();
        return this;
    }
    _handleResponse(message) {
        var _a;
        if (message.time != null) {
            (_a = this.histogram) === null || _a === void 0 ? void 0 : _a.record(histogram_1.PiscinaHistogramHandler.toHistogramIntegerNano(message.time));
        }
        this.onMessage(message);
        if (this.taskInfos.size === 0) {
            // No more tasks running on this Worker means it should not keep the
            // process running.
            this.unref();
        }
    }
    postTask(taskInfo) {
        (0, node_assert_1.default)(!this.taskInfos.has(taskInfo.taskId));
        (0, node_assert_1.default)(!this.terminating && !this.destroyed);
        const message = {
            task: taskInfo.releaseTask(),
            taskId: taskInfo.taskId,
            filename: taskInfo.filename,
            name: taskInfo.name,
            histogramEnabled: this.histogram != null ? 1 : 0
        };
        try {
            this.port.postMessage(message, taskInfo.transferList);
        }
        catch (err) {
            // This would mostly happen if e.g. message contains unserializable data
            // or transferList is invalid.
            taskInfo.done(err);
            return;
        }
        taskInfo.workerInfo = this;
        this.taskInfos.set(taskInfo.taskId, taskInfo);
        queueMicrotask(() => this.clearIdleTimeout());
        this.ref();
        // Inform the worker that there are new messages posted, and wake it up
        // if it is waiting for one.
        Atomics.add(this.sharedBuffer, symbols_1.kRequestCountField, 1);
        Atomics.notify(this.sharedBuffer, symbols_1.kRequestCountField, 1);
    }
    processPendingMessages() {
        if (this.destroyed)
            return;
        // If we *know* that there are more messages than we have received using
        // 'message' events yet, then try to load and handle them synchronously,
        // without the need to wait for more expensive events on the event loop.
        // This would usually break async tracking, but in our case, we already have
        // the extra TaskInfo/AsyncResource layer that rectifies that situation.
        const actualResponseCount = Atomics.load(this.sharedBuffer, symbols_1.kResponseCountField);
        if (actualResponseCount !== this.lastSeenResponseCount) {
            this.lastSeenResponseCount = actualResponseCount;
            let entry;
            while ((entry = (0, node_worker_threads_1.receiveMessageOnPort)(this.port)) !== undefined) {
                this._handleResponse(entry.message);
            }
        }
    }
    isRunningAbortableTask() {
        // If there are abortable tasks, we are running one at most per Worker.
        if (this.taskInfos.size !== 1)
            return false;
        const [[, task]] = this.taskInfos;
        return task.abortSignal !== null;
    }
    currentUsage() {
        if (this.isRunningAbortableTask())
            return Infinity;
        return this.taskInfos.size;
    }
    get interface() {
        const worker = this;
        return {
            get id() {
                return worker.worker.threadId;
            },
            get currentUsage() {
                return worker.currentUsage();
            },
            get isRunningAbortableTask() {
                return worker.isRunningAbortableTask();
            },
            get histogram() {
                return worker.histogram != null ? histogram_1.PiscinaHistogramHandler.createHistogramSummary(worker.histogram) : null;
            },
            get terminating() {
                return worker.terminating;
            },
            get destroyed() {
                return worker.destroyed;
            },
            [symbols_1.kWorkerData]: worker
        };
    }
}
exports.WorkerInfo = WorkerInfo;
//# sourceMappingURL=index.js.map