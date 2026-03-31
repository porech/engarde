"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.scheduleByName = scheduleByName;
exports.scheduleByTarget = scheduleByTarget;
const rxjs_1 = require("rxjs");
const api_1 = require("./api");
const jobs_1 = require("./jobs");
const progressSchema = require('./progress-schema.json');
let _uniqueId = 0;
async function scheduleByName(name, buildOptions, options) {
    const childLoggerName = options.target ? `{${(0, api_1.targetStringFromTarget)(options.target)}}` : name;
    const logger = options.logger.createChild(childLoggerName);
    const job = options.scheduler.schedule(name, {});
    let stateSubscription;
    const workspaceRoot = await options.workspaceRoot;
    const currentDirectory = await options.currentDirectory;
    const description = await (0, rxjs_1.firstValueFrom)(job.description);
    const info = description.info;
    const id = ++_uniqueId;
    const message = {
        id,
        currentDirectory,
        workspaceRoot,
        info: info,
        options: buildOptions,
        ...(options.target ? { target: options.target } : {}),
    };
    // Wait for the job to be ready.
    if (job.state !== jobs_1.JobState.Started) {
        stateSubscription = job.outboundBus.subscribe({
            next: (event) => {
                if (event.kind === jobs_1.JobOutboundMessageKind.Start) {
                    job.input.next(message);
                }
            },
            error: () => { },
        });
    }
    else {
        job.input.next(message);
    }
    const logChannelSub = job.getChannel('log').subscribe({
        next: (entry) => {
            logger.next(entry);
        },
        error: () => { },
    });
    const outboundBusSub = job.outboundBus.subscribe({
        error() { },
        complete() {
            outboundBusSub.unsubscribe();
            logChannelSub.unsubscribe();
            stateSubscription.unsubscribe();
        },
    });
    const output = job.output.pipe((0, rxjs_1.map)((output) => ({
        ...output,
        ...(options.target ? { target: options.target } : 0),
        info,
    })), (0, rxjs_1.shareReplay)());
    // Start the builder.
    output.pipe((0, rxjs_1.first)()).subscribe({
        error: () => { },
    });
    return {
        id,
        info,
        // This is a getter so that it always returns the next output, and not the same one.
        get result() {
            return (0, rxjs_1.firstValueFrom)(output);
        },
        get lastOutput() {
            return (0, rxjs_1.lastValueFrom)(output);
        },
        output,
        progress: job
            .getChannel('progress', progressSchema)
            .pipe((0, rxjs_1.shareReplay)(1)),
        stop() {
            job.stop();
            return job.outboundBus
                .pipe((0, rxjs_1.ignoreElements)(), (0, rxjs_1.catchError)(() => rxjs_1.EMPTY))
                .toPromise();
        },
    };
}
async function scheduleByTarget(target, overrides, options) {
    return scheduleByName(`{${(0, api_1.targetStringFromTarget)(target)}}`, overrides, {
        ...options,
        target,
        logger: options.logger,
    });
}
