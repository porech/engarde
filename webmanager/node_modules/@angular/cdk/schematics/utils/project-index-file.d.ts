/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import { ProjectDefinition } from '@schematics/angular/utility';
/**
 * Gets the path of the index file in the given project.
 * This only searches the base options for each target and not any defined target configurations.
 */
export declare function getProjectIndexFiles(project: ProjectDefinition): string[];
