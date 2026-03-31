"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.subscribeToWorkflow = subscribeToWorkflow;
const color_1 = require("../../utilities/color");
function removeLeadingSlash(value) {
    return value[0] === '/' ? value.slice(1) : value;
}
function subscribeToWorkflow(workflow, logger) {
    const files = new Set();
    let error = false;
    let logs = [];
    const reporterSubscription = workflow.reporter.subscribe((event) => {
        // Strip leading slash to prevent confusion.
        const eventPath = removeLeadingSlash(event.path);
        switch (event.kind) {
            case 'error':
                error = true;
                logger.error(`ERROR! ${eventPath} ${event.description == 'alreadyExist' ? 'already exists' : 'does not exist'}.`);
                break;
            case 'update':
                logs.push(
                // TODO: `as unknown` was necessary during TS 5.9 update. Figure out a long-term solution.
                `${color_1.colors.cyan('UPDATE')} ${eventPath} (${event.content.length} bytes)`);
                files.add(eventPath);
                break;
            case 'create':
                logs.push(
                // TODO: `as unknown` was necessary during TS 5.9 update. Figure out a long-term solution.
                `${color_1.colors.green('CREATE')} ${eventPath} (${event.content.length} bytes)`);
                files.add(eventPath);
                break;
            case 'delete':
                logs.push(`${color_1.colors.yellow('DELETE')} ${eventPath}`);
                files.add(eventPath);
                break;
            case 'rename':
                logs.push(`${color_1.colors.blue('RENAME')} ${eventPath} => ${removeLeadingSlash(event.to)}`);
                files.add(eventPath);
                break;
        }
    });
    const lifecycleSubscription = workflow.lifeCycle.subscribe((event) => {
        if (event.kind == 'end' || event.kind == 'post-tasks-start') {
            if (!error) {
                // Output the logging queue, no error happened.
                logs.forEach((log) => logger.info(log));
            }
            logs = [];
            error = false;
        }
    });
    return {
        files,
        error,
        unsubscribe: () => {
            reporterSubscription.unsubscribe();
            lifecycleSubscription.unsubscribe();
        },
    };
}
