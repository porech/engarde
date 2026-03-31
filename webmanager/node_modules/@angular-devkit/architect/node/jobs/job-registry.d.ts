/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import { JsonValue } from '@angular-devkit/core';
import { Observable } from 'rxjs';
import { jobs } from '../../src';
export declare class NodeModuleJobRegistry<MinimumArgumentValueT extends JsonValue = JsonValue, MinimumInputValueT extends JsonValue = JsonValue, MinimumOutputValueT extends JsonValue = JsonValue> implements jobs.Registry<MinimumArgumentValueT, MinimumInputValueT, MinimumOutputValueT> {
    protected _resolve(name: string): string | null;
    /**
     * Get a job description for a named job.
     *
     * @param name The name of the job.
     * @returns A description, or null if the job is not registered.
     */
    get<A extends MinimumArgumentValueT, I extends MinimumInputValueT, O extends MinimumOutputValueT>(name: jobs.JobName): Observable<jobs.JobHandler<A, I, O> | null>;
}
