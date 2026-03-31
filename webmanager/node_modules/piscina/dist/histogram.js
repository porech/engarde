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
var _PiscinaHistogramHandler_runTime, _PiscinaHistogramHandler_waitTime;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PiscinaHistogramHandler = void 0;
const node_perf_hooks_1 = require("node:perf_hooks");
class PiscinaHistogramHandler {
    constructor() {
        _PiscinaHistogramHandler_runTime.set(this, void 0);
        _PiscinaHistogramHandler_waitTime.set(this, void 0);
        __classPrivateFieldSet(this, _PiscinaHistogramHandler_runTime, (0, node_perf_hooks_1.createHistogram)(), "f");
        __classPrivateFieldSet(this, _PiscinaHistogramHandler_waitTime, (0, node_perf_hooks_1.createHistogram)(), "f");
    }
    get runTimeSummary() {
        return PiscinaHistogramHandler.createHistogramSummary(__classPrivateFieldGet(this, _PiscinaHistogramHandler_runTime, "f"));
    }
    get waitTimeSummary() {
        return PiscinaHistogramHandler.createHistogramSummary(__classPrivateFieldGet(this, _PiscinaHistogramHandler_waitTime, "f"));
    }
    get runTimeCount() {
        return __classPrivateFieldGet(this, _PiscinaHistogramHandler_runTime, "f").count;
    }
    recordRunTime(value) {
        __classPrivateFieldGet(this, _PiscinaHistogramHandler_runTime, "f").record(PiscinaHistogramHandler.toHistogramIntegerNano(value));
    }
    recordWaitTime(value) {
        __classPrivateFieldGet(this, _PiscinaHistogramHandler_waitTime, "f").record(PiscinaHistogramHandler.toHistogramIntegerNano(value));
    }
    resetWaitTime() {
        __classPrivateFieldGet(this, _PiscinaHistogramHandler_waitTime, "f").reset();
    }
    resetRunTime() {
        __classPrivateFieldGet(this, _PiscinaHistogramHandler_runTime, "f").reset();
    }
    static createHistogramSummary(histogram) {
        const { mean, stddev, min, max } = histogram;
        return {
            average: mean / 1000,
            mean: mean / 1000,
            stddev,
            min: min / 1000,
            max: max / 1000,
            p0_001: histogram.percentile(0.001) / 1000,
            p0_01: histogram.percentile(0.01) / 1000,
            p0_1: histogram.percentile(0.1) / 1000,
            p1: histogram.percentile(1) / 1000,
            p2_5: histogram.percentile(2.5) / 1000,
            p10: histogram.percentile(10) / 1000,
            p25: histogram.percentile(25) / 1000,
            p50: histogram.percentile(50) / 1000,
            p75: histogram.percentile(75) / 1000,
            p90: histogram.percentile(90) / 1000,
            p97_5: histogram.percentile(97.5) / 1000,
            p99: histogram.percentile(99) / 1000,
            p99_9: histogram.percentile(99.9) / 1000,
            p99_99: histogram.percentile(99.99) / 1000,
            p99_999: histogram.percentile(99.999) / 1000,
        };
    }
    static toHistogramIntegerNano(milliseconds) {
        return Math.max(1, Math.trunc(milliseconds * 1000));
    }
}
exports.PiscinaHistogramHandler = PiscinaHistogramHandler;
_PiscinaHistogramHandler_runTime = new WeakMap(), _PiscinaHistogramHandler_waitTime = new WeakMap();
//# sourceMappingURL=histogram.js.map