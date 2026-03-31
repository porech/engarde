/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import { json, logging } from '@angular-devkit/core';
import { Observable } from 'rxjs';
import { BuilderRun, Target } from './api';
import { ArchitectHost } from './internal';
import { JobName, Registry } from './jobs';
export interface ScheduleOptions {
    logger?: logging.Logger;
}
export declare class Architect {
    private _host;
    private readonly _scheduler;
    private readonly _jobCache;
    private readonly _infoCache;
    constructor(_host: ArchitectHost, registry?: json.schema.SchemaRegistry, additionalJobRegistry?: Registry);
    has(name: JobName): Observable<boolean>;
    scheduleBuilder(name: string, options: json.JsonObject, scheduleOptions?: ScheduleOptions): Promise<BuilderRun>;
    scheduleTarget(target: Target, overrides?: json.JsonObject, scheduleOptions?: ScheduleOptions): Promise<BuilderRun>;
}
