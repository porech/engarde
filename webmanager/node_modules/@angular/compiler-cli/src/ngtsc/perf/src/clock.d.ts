/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
export type HrTime = [number, number];
export declare function mark(): HrTime;
export declare function timeSinceInMicros(mark: HrTime): number;
