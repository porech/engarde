/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import { json, logging } from '@angular-devkit/core';
import { BuilderRun, Target } from './api';
import { Scheduler } from './jobs';
export declare function scheduleByName(name: string, buildOptions: json.JsonObject, options: {
    target?: Target;
    scheduler: Scheduler;
    logger: logging.LoggerApi;
    workspaceRoot: string | Promise<string>;
    currentDirectory: string | Promise<string>;
}): Promise<BuilderRun>;
export declare function scheduleByTarget(target: Target, overrides: json.JsonObject, options: {
    scheduler: Scheduler;
    logger: logging.LoggerApi;
    workspaceRoot: string | Promise<string>;
    currentDirectory: string | Promise<string>;
}): Promise<BuilderRun>;
