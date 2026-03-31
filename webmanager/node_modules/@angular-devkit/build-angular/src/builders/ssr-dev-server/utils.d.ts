/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import { SpawnOptions } from 'node:child_process';
import { Observable } from 'rxjs';
export declare function getAvailablePort(): Promise<number>;
export declare function spawnAsObservable(command: string, args?: string[], options?: SpawnOptions): Observable<{
    stdout?: string;
    stderr?: string;
}>;
export declare function waitUntilServerIsListening(port: number, host?: string): Observable<undefined>;
