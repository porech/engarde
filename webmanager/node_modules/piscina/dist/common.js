"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commonState = exports.READY = void 0;
exports.isTransferable = isTransferable;
exports.isMovable = isMovable;
exports.markMovable = markMovable;
exports.maybeFileURLToPath = maybeFileURLToPath;
exports.getAvailableParallelism = getAvailableParallelism;
const node_url_1 = require("node:url");
const node_os_1 = require("node:os");
const symbols_1 = require("./symbols");
// States wether the worker is ready to receive tasks
exports.READY = '_WORKER_READY';
/**
 * True if the object implements the Transferable interface
 *
 * @export
 * @param {unknown} value
 * @return {*}  {boolean}
 */
function isTransferable(value) {
    return (value != null &&
        typeof value === 'object' &&
        symbols_1.kTransferable in value &&
        symbols_1.kValue in value);
}
/**
 * True if object implements Transferable and has been returned
 * by the Piscina.move() function
 *
 * TODO: narrow down the type of value
 * @export
 * @param {(unknown & PiscinaMovable)} value
 * @return {*}  {boolean}
 */
function isMovable(value) {
    return isTransferable(value) && value[symbols_1.kMovable] === true;
}
function markMovable(value) {
    Object.defineProperty(value, symbols_1.kMovable, {
        enumerable: false,
        configurable: true,
        writable: true,
        value: true
    });
}
// State of Piscina pool
exports.commonState = {
    isWorkerThread: false,
    workerData: undefined
};
function maybeFileURLToPath(filename) {
    return filename.startsWith('file:')
        ? (0, node_url_1.fileURLToPath)(new node_url_1.URL(filename))
        : filename;
}
function getAvailableParallelism() {
    return (0, node_os_1.availableParallelism)();
}
//# sourceMappingURL=common.js.map