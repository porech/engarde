/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
export declare function findTests(include: string[], exclude: string[], workspaceRoot: string, projectSourceRoot: string): Promise<string[]>;
interface TestEntrypointsOptions {
    projectSourceRoot: string;
    workspaceRoot: string;
}
/** Generate unique bundle names for a set of test files. */
export declare function getTestEntrypoints(testFiles: string[], { projectSourceRoot, workspaceRoot }: TestEntrypointsOptions): Map<string, string>;
export {};
