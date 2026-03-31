"use strict";
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _FixedQueue_size;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FixedQueue = void 0;
/*
 * Modified Fixed Queue Implementation based on the one from Node.js Project
 * License: MIT License
 * Source: https://github.com/nodejs/node/blob/de7b37880f5a541d5f874c1c2362a65a4be76cd0/lib/internal/fixed_queue.js
 */
const node_assert_1 = __importDefault(require("node:assert"));
// Currently optimal queue size, tested on V8 6.0 - 6.6. Must be power of two.
const kSize = 2048;
const kMask = kSize - 1;
// The FixedQueue is implemented as a singly-linked list of fixed-size
// circular buffers. It looks something like this:
//
//  head                                                       tail
//    |                                                          |
//    v                                                          v
// +-----------+ <-----\       +-----------+ <------\         +-----------+
// |  [null]   |        \----- |   next    |         \------- |   next    |
// +-----------+               +-----------+                  +-----------+
// |   item    | <-- bottom    |   item    | <-- bottom       |  [empty]  |
// |   item    |               |   item    |                  |  [empty]  |
// |   item    |               |   item    |                  |  [empty]  |
// |   item    |               |   item    |                  |  [empty]  |
// |   item    |               |   item    |       bottom --> |   item    |
// |   item    |               |   item    |                  |   item    |
// |    ...    |               |    ...    |                  |    ...    |
// |   item    |               |   item    |                  |   item    |
// |   item    |               |   item    |                  |   item    |
// |  [empty]  | <-- top       |   item    |                  |   item    |
// |  [empty]  |               |   item    |                  |   item    |
// |  [empty]  |               |  [empty]  | <-- top  top --> |  [empty]  |
// +-----------+               +-----------+                  +-----------+
//
// Or, if there is only one circular buffer, it looks something
// like either of these:
//
//  head   tail                                 head   tail
//    |     |                                     |     |
//    v     v                                     v     v
// +-----------+                               +-----------+
// |  [null]   |                               |  [null]   |
// +-----------+                               +-----------+
// |  [empty]  |                               |   item    |
// |  [empty]  |                               |   item    |
// |   item    | <-- bottom            top --> |  [empty]  |
// |   item    |                               |  [empty]  |
// |  [empty]  | <-- top            bottom --> |   item    |
// |  [empty]  |                               |   item    |
// +-----------+                               +-----------+
//
// Adding a value means moving `top` forward by one, removing means
// moving `bottom` forward by one. After reaching the end, the queue
// wraps around.
//
// When `top === bottom` the current queue is empty and when
// `top + 1 === bottom` it's full. This wastes a single space of storage
// but allows much quicker checks.
class FixedCircularBuffer {
    constructor() {
        this.bottom = 0;
        this.top = 0;
        this.list = new Array(kSize);
        this.next = null;
    }
    isEmpty() {
        return this.top === this.bottom;
    }
    isFull() {
        return ((this.top + 1) & kMask) === this.bottom;
    }
    push(data) {
        this.list[this.top] = data;
        this.top = (this.top + 1) & kMask;
    }
    shift() {
        const nextItem = this.list[this.bottom];
        if (nextItem === undefined) {
            return null;
        }
        this.list[this.bottom] = undefined;
        this.bottom = (this.bottom + 1) & kMask;
        return nextItem;
    }
    remove(task) {
        const indexToRemove = this.list.indexOf(task);
        node_assert_1.default.notStrictEqual(indexToRemove, -1);
        let curr = indexToRemove;
        while (true) {
            const next = (curr + 1) & kMask;
            this.list[curr] = this.list[next];
            if (this.list[curr] === undefined) {
                break;
            }
            if (next === indexToRemove) {
                this.list[curr] = undefined;
                break;
            }
            curr = next;
        }
        this.top = (this.top - 1) & kMask;
    }
}
class FixedQueue {
    constructor() {
        _FixedQueue_size.set(this, 0);
        this.head = this.tail = new FixedCircularBuffer();
    }
    isEmpty() {
        return this.head.isEmpty();
    }
    push(data) {
        var _a;
        if (this.head.isFull()) {
            // Head is full: Creates a new queue, sets the old queue's `.next` to it,
            // and sets it as the new main queue.
            this.head = this.head.next = new FixedCircularBuffer();
        }
        this.head.push(data);
        __classPrivateFieldSet(this, _FixedQueue_size, (_a = __classPrivateFieldGet(this, _FixedQueue_size, "f"), _a++, _a), "f");
    }
    shift() {
        var _a;
        const tail = this.tail;
        const next = tail.shift();
        if (next !== null)
            __classPrivateFieldSet(this, _FixedQueue_size, (_a = __classPrivateFieldGet(this, _FixedQueue_size, "f"), _a--, _a), "f");
        if (tail.isEmpty() && tail.next !== null) {
            // If there is another queue, it forms the new tail.
            this.tail = tail.next;
            tail.next = null;
        }
        return next;
    }
    remove(task) {
        var _a;
        let prev = null;
        let buffer = this.tail;
        while (true) {
            if (buffer.list.includes(task)) {
                buffer.remove(task);
                __classPrivateFieldSet(this, _FixedQueue_size, (_a = __classPrivateFieldGet(this, _FixedQueue_size, "f"), _a--, _a), "f");
                break;
            }
            if (buffer.next === null)
                break;
            prev = buffer;
            buffer = buffer.next;
        }
        if (buffer.isEmpty()) {
            // removing tail
            if (prev === null) {
                // if tail is not the last buffer
                if (buffer.next !== null)
                    this.tail = buffer.next;
            }
            else {
                // removing head
                if (buffer.next === null) {
                    this.head = prev;
                }
                else {
                    // removing buffer from middle
                    prev.next = buffer.next;
                }
            }
        }
    }
    get size() {
        return __classPrivateFieldGet(this, _FixedQueue_size, "f");
    }
}
exports.FixedQueue = FixedQueue;
_FixedQueue_size = new WeakMap();
;
//# sourceMappingURL=fixed_queue.js.map