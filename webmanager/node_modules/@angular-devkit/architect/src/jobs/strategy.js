"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.serialize = serialize;
exports.reuse = reuse;
exports.memoize = memoize;
const core_1 = require("@angular-devkit/core");
const rxjs_1 = require("rxjs");
const api_1 = require("./api");
/**
 * Creates a JobStrategy that serializes every call. This strategy can be mixed between jobs.
 */
function serialize() {
    let latest = (0, rxjs_1.of)();
    return (handler, options) => {
        const newHandler = (argument, context) => {
            const previous = latest;
            latest = (0, rxjs_1.concat)(previous.pipe((0, rxjs_1.ignoreElements)()), new rxjs_1.Observable((o) => handler(argument, context).subscribe(o))).pipe((0, rxjs_1.shareReplay)(0));
            return latest;
        };
        return Object.assign(newHandler, {
            jobDescription: Object.assign({}, handler.jobDescription, options),
        });
    };
}
/**
 * Creates a JobStrategy that will always reuse a running job, and restart it if the job ended.
 * @param replayMessages Replay ALL messages if a job is reused, otherwise just hook up where it
 * is.
 */
function reuse(replayMessages = false) {
    let inboundBus = new rxjs_1.Subject();
    let run = null;
    let state = null;
    return (handler, options) => {
        const newHandler = (argument, context) => {
            // Forward inputs.
            const subscription = context.inboundBus.subscribe(inboundBus);
            if (run) {
                return (0, rxjs_1.concat)(
                // Update state.
                (0, rxjs_1.of)(state), run).pipe((0, rxjs_1.finalize)(() => subscription.unsubscribe()));
            }
            run = handler(argument, { ...context, inboundBus: inboundBus.asObservable() }).pipe((0, rxjs_1.tap)((message) => {
                if (message.kind == api_1.JobOutboundMessageKind.Start ||
                    message.kind == api_1.JobOutboundMessageKind.OnReady ||
                    message.kind == api_1.JobOutboundMessageKind.End) {
                    state = message;
                }
            }, undefined, () => {
                subscription.unsubscribe();
                inboundBus = new rxjs_1.Subject();
                run = null;
            }), replayMessages ? (0, rxjs_1.shareReplay)() : (0, rxjs_1.share)());
            return run;
        };
        return Object.assign(newHandler, handler, options || {});
    };
}
/**
 * Creates a JobStrategy that will reuse a running job if the argument matches.
 * @param replayMessages Replay ALL messages if a job is reused, otherwise just hook up where it
 * is.
 */
function memoize(replayMessages = false) {
    const runs = new Map();
    return (handler, options) => {
        const newHandler = (argument, context) => {
            const argumentJson = JSON.stringify((0, core_1.isJsonObject)(argument)
                ? Object.keys(argument)
                    .sort()
                    .reduce((result, key) => {
                    result[key] = argument[key];
                    return result;
                }, {})
                : argument);
            const maybeJob = runs.get(argumentJson);
            if (maybeJob) {
                return maybeJob;
            }
            const run = handler(argument, context).pipe(replayMessages ? (0, rxjs_1.shareReplay)() : (0, rxjs_1.share)());
            runs.set(argumentJson, run);
            return run;
        };
        return Object.assign(newHandler, handler, options || {});
    };
}
