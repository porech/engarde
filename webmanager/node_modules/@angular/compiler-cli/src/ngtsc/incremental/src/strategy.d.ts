/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import ts from 'typescript';
import { IncrementalState } from './state';
/**
 * Strategy used to manage the association between a `ts.Program` and the `IncrementalState` which
 * represents the reusable Angular part of its compilation.
 */
export interface IncrementalBuildStrategy {
    /**
     * Determine the Angular `IncrementalState` for the given `ts.Program`, if one is available.
     */
    getIncrementalState(program: ts.Program): IncrementalState | null;
    /**
     * Associate the given `IncrementalState` with the given `ts.Program` and make it available to
     * future compilations.
     */
    setIncrementalState(driver: IncrementalState, program: ts.Program): void;
    /**
     * Convert this `IncrementalBuildStrategy` into a possibly new instance to be used in the next
     * incremental compilation (may be a no-op if the strategy is not stateful).
     */
    toNextBuildStrategy(): IncrementalBuildStrategy;
}
/**
 * A noop implementation of `IncrementalBuildStrategy` which neither returns nor tracks any
 * incremental data.
 */
export declare class NoopIncrementalBuildStrategy implements IncrementalBuildStrategy {
    getIncrementalState(): null;
    setIncrementalState(): void;
    toNextBuildStrategy(): IncrementalBuildStrategy;
}
/**
 * Tracks an `IncrementalState` within the strategy itself.
 */
export declare class TrackedIncrementalBuildStrategy implements IncrementalBuildStrategy {
    private state;
    private isSet;
    getIncrementalState(): IncrementalState | null;
    setIncrementalState(state: IncrementalState): void;
    toNextBuildStrategy(): TrackedIncrementalBuildStrategy;
}
/**
 * Manages the `IncrementalState` associated with a `ts.Program` by monkey-patching it onto the
 * program under `SYM_INCREMENTAL_STATE`.
 */
export declare class PatchedProgramIncrementalBuildStrategy implements IncrementalBuildStrategy {
    getIncrementalState(program: ts.Program): IncrementalState | null;
    setIncrementalState(state: IncrementalState, program: ts.Program): void;
    toNextBuildStrategy(): IncrementalBuildStrategy;
}
