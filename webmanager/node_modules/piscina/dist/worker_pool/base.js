"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AsynchronouslyCreatedResourcePool = exports.AsynchronouslyCreatedResource = void 0;
const node_assert_1 = __importDefault(require("node:assert"));
class AsynchronouslyCreatedResource {
    constructor() {
        this.onreadyListeners = [];
        this.ondestroyListeners = [];
    }
    markAsReady() {
        const listeners = this.onreadyListeners;
        (0, node_assert_1.default)(listeners !== null);
        this.onreadyListeners = null;
        for (const listener of listeners) {
            listener();
        }
    }
    isReady() {
        return this.onreadyListeners === null;
    }
    onReady(fn) {
        if (this.onreadyListeners === null) {
            fn(); // Zalgo is okay here.
            return;
        }
        this.onreadyListeners.push(fn);
    }
    onDestroy(fn) {
        if (this.ondestroyListeners === null) {
            return;
        }
        this.ondestroyListeners.push(fn);
    }
    markAsDestroyed() {
        const listeners = this.ondestroyListeners;
        (0, node_assert_1.default)(listeners !== null);
        this.ondestroyListeners = null;
        for (const listener of listeners) {
            listener();
        }
    }
    isDestroyed() {
        return this.ondestroyListeners === null;
    }
}
exports.AsynchronouslyCreatedResource = AsynchronouslyCreatedResource;
// TODO: this will eventually become an scheduler
class AsynchronouslyCreatedResourcePool {
    constructor(maximumUsage) {
        this.pendingItems = new Set();
        this.readyItems = new Set();
        this.maximumUsage = maximumUsage;
        this.onAvailableListeners = [];
        this.onTaskDoneListeners = [];
    }
    add(item) {
        this.pendingItems.add(item);
        item.onReady(() => {
            /* istanbul ignore else */
            if (this.pendingItems.has(item)) {
                this.pendingItems.delete(item);
                this.readyItems.add(item);
                this.maybeAvailable(item);
            }
        });
    }
    delete(item) {
        this.pendingItems.delete(item);
        this.readyItems.delete(item);
    }
    *[Symbol.iterator]() {
        yield* this.pendingItems;
        yield* this.readyItems;
    }
    get size() {
        return this.pendingItems.size + this.readyItems.size;
    }
    maybeAvailable(item) {
        /* istanbul ignore else */
        if (item.currentUsage() < this.maximumUsage) {
            for (const listener of this.onAvailableListeners) {
                listener(item);
            }
        }
    }
    onAvailable(fn) {
        this.onAvailableListeners.push(fn);
    }
    taskDone(item) {
        for (let i = 0; i < this.onTaskDoneListeners.length; i++) {
            this.onTaskDoneListeners[i](item);
        }
    }
    onTaskDone(fn) {
        this.onTaskDoneListeners.push(fn);
    }
    getCurrentUsage() {
        let inFlight = 0;
        for (const worker of this.readyItems) {
            const currentUsage = worker.currentUsage();
            if (Number.isFinite(currentUsage))
                inFlight += currentUsage;
        }
        return inFlight;
    }
}
exports.AsynchronouslyCreatedResourcePool = AsynchronouslyCreatedResourcePool;
//# sourceMappingURL=base.js.map