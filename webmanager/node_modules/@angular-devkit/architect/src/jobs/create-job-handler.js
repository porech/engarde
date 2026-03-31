"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChannelAlreadyExistException = void 0;
exports.createJobHandler = createJobHandler;
exports.createJobFactory = createJobFactory;
exports.createLoggerJob = createLoggerJob;
const core_1 = require("@angular-devkit/core");
const rxjs_1 = require("rxjs");
const api_1 = require("./api");
class ChannelAlreadyExistException extends core_1.BaseException {
    constructor(name) {
        super(`Channel ${JSON.stringify(name)} already exist.`);
    }
}
exports.ChannelAlreadyExistException = ChannelAlreadyExistException;
/**
 * Make a simple job handler that sets start and end from a function that's synchronous.
 *
 * @param fn The function to create a handler for.
 * @param options An optional set of properties to set on the handler. Some fields might be
 *   required by registry or schedulers.
 */
function createJobHandler(fn, options = {}) {
    const handler = (argument, context) => {
        const description = context.description;
        const inboundBus = context.inboundBus;
        const inputChannel = new rxjs_1.Subject();
        let subscription;
        const teardownLogics = [];
        let tearingDown = false;
        return new rxjs_1.Observable((subject) => {
            function complete() {
                if (subscription) {
                    subscription.unsubscribe();
                }
                subject.next({ kind: api_1.JobOutboundMessageKind.End, description });
                subject.complete();
                inputChannel.complete();
            }
            // Handle input.
            const inboundSub = inboundBus.subscribe((message) => {
                switch (message.kind) {
                    case api_1.JobInboundMessageKind.Ping:
                        subject.next({ kind: api_1.JobOutboundMessageKind.Pong, description, id: message.id });
                        break;
                    case api_1.JobInboundMessageKind.Stop:
                        // Run teardown logic then complete.
                        tearingDown = true;
                        if (teardownLogics.length) {
                            Promise.all(teardownLogics.map((fn) => fn())).then(() => complete(), () => complete());
                        }
                        else {
                            complete();
                        }
                        break;
                    case api_1.JobInboundMessageKind.Input:
                        if (!tearingDown) {
                            inputChannel.next(message.value);
                        }
                        break;
                }
            });
            // Execute the function with the additional context.
            const channels = new Map();
            const newContext = {
                ...context,
                input: inputChannel.asObservable(),
                addTeardown(teardown) {
                    teardownLogics.push(teardown);
                },
                createChannel(name) {
                    if (channels.has(name)) {
                        throw new ChannelAlreadyExistException(name);
                    }
                    const channelSubject = new rxjs_1.Subject();
                    const channelSub = channelSubject.subscribe((message) => {
                        subject.next({
                            kind: api_1.JobOutboundMessageKind.ChannelMessage,
                            description,
                            name,
                            message,
                        });
                    }, (error) => {
                        subject.next({ kind: api_1.JobOutboundMessageKind.ChannelError, description, name, error });
                        // This can be reopened.
                        channels.delete(name);
                    }, () => {
                        subject.next({ kind: api_1.JobOutboundMessageKind.ChannelComplete, description, name });
                        // This can be reopened.
                        channels.delete(name);
                    });
                    channels.set(name, channelSubject);
                    if (subscription) {
                        subscription.add(channelSub);
                    }
                    return channelSubject;
                },
            };
            subject.next({ kind: api_1.JobOutboundMessageKind.Start, description });
            let result = fn(argument, newContext);
            // If the result is a promise, simply wait for it to complete before reporting the result.
            if ((0, core_1.isPromise)(result)) {
                result = (0, rxjs_1.from)(result);
            }
            else if (!(0, rxjs_1.isObservable)(result)) {
                result = (0, rxjs_1.of)(result);
            }
            subscription = result.subscribe((value) => subject.next({ kind: api_1.JobOutboundMessageKind.Output, description, value }), (error) => subject.error(error), () => complete());
            subscription.add(inboundSub);
            return subscription;
        });
    };
    return Object.assign(handler, { jobDescription: options });
}
/**
 * Lazily create a job using a function.
 * @param loader A factory function that returns a promise/observable of a JobHandler.
 * @param options Same options as createJob.
 */
function createJobFactory(loader, options = {}) {
    const handler = (argument, context) => {
        return (0, rxjs_1.from)(loader()).pipe((0, rxjs_1.switchMap)((fn) => fn(argument, context)));
    };
    return Object.assign(handler, { jobDescription: options });
}
/**
 * Creates a job that logs out input/output messages of another Job. The messages are still
 * propagated to the other job.
 */
function createLoggerJob(job, logger) {
    const handler = (argument, context) => {
        context.inboundBus
            .pipe((0, rxjs_1.tap)((message) => logger.info(`Input: ${JSON.stringify(message)}`)))
            .subscribe();
        return job(argument, context).pipe((0, rxjs_1.tap)((message) => logger.info(`Message: ${JSON.stringify(message)}`), (error) => logger.warn(`Error: ${JSON.stringify(error)}`), () => logger.info(`Completed`)));
    };
    return Object.assign(handler, job);
}
