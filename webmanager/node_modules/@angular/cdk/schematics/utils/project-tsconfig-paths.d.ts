/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import { Tree } from '@angular-devkit/schematics';
import { ProjectDefinition, WorkspaceDefinition } from '@schematics/angular/utility';
import { WorkspacePath } from '../update-tool/file-system';
/** Gets the tsconfig path from the given target within the specified project. */
export declare function getTargetTsconfigPath(project: ProjectDefinition, targetName: string): WorkspacePath | null;
/** Resolve the workspace configuration of the specified tree gracefully. */
export declare function getWorkspaceConfigGracefully(tree: Tree): Promise<WorkspaceDefinition | null>;
