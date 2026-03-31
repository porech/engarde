/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import { JsonValue } from '@angular-devkit/core';
import { JobDescription, JobHandler } from './api';
export type JobStrategy<A extends JsonValue = JsonValue, I extends JsonValue = JsonValue, O extends JsonValue = JsonValue> = (handler: JobHandler<A, I, O>, options?: Partial<Readonly<JobDescription>>) => JobHandler<A, I, O>;
/**
 * Creates a JobStrategy that serializes every call. This strategy can be mixed between jobs.
 */
export declare function serialize<A extends JsonValue = JsonValue, I extends JsonValue = JsonValue, O extends JsonValue = JsonValue>(): JobStrategy<A, I, O>;
/**
 * Creates a JobStrategy that will always reuse a running job, and restart it if the job ended.
 * @param replayMessages Replay ALL messages if a job is reused, otherwise just hook up where it
 * is.
 */
export declare function reuse<A extends JsonValue = JsonValue, I extends JsonValue = JsonValue, O extends JsonValue = JsonValue>(replayMessages?: boolean): JobStrategy<A, I, O>;
/**
 * Creates a JobStrategy that will reuse a running job if the argument matches.
 * @param replayMessages Replay ALL messages if a job is reused, otherwise just hook up where it
 * is.
 */
export declare function memoize<A extends JsonValue = JsonValue, I extends JsonValue = JsonValue, O extends JsonValue = JsonValue>(replayMessages?: boolean): JobStrategy<A, I, O>;
