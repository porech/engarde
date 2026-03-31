/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import { logging } from '@angular-devkit/core';
import { NodeWorkflow } from '@angular-devkit/schematics/tools';
export declare function subscribeToWorkflow(workflow: NodeWorkflow, logger: logging.LoggerApi): {
    files: Set<string>;
    error: boolean;
    unsubscribe: () => void;
};
