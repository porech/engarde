/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import type { CommandContext } from '../command-builder/command-module';
import { EventCustomDimension, EventCustomMetric, PrimitiveTypes } from './analytics-parameters';
export declare class AnalyticsCollector {
    private context;
    private trackingEventsQueue;
    private readonly requestParameterStringified;
    private readonly userParameters;
    constructor(context: CommandContext, userId: string);
    reportWorkspaceInfoEvent(parameters: Partial<Record<EventCustomMetric, string | boolean | number | undefined>>): void;
    reportRebuildRunEvent(parameters: Partial<Record<EventCustomMetric & EventCustomDimension, string | boolean | number | undefined>>): void;
    reportBuildRunEvent(parameters: Partial<Record<EventCustomMetric & EventCustomDimension, string | boolean | number | undefined>>): void;
    reportArchitectRunEvent(parameters: Partial<Record<EventCustomDimension, PrimitiveTypes>>): void;
    reportSchematicRunEvent(parameters: Partial<Record<EventCustomDimension, PrimitiveTypes>>): void;
    reportCommandRunEvent(command: string): void;
    private event;
    /**
     * Flush on an interval (if the event loop is waiting).
     *
     * @returns a method that when called will terminate the periodic
     * flush and call flush one last time.
     */
    periodFlush(): () => Promise<void>;
    flush(): Promise<void>;
    private send;
}
