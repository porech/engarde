/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import { json, workspaces } from '@angular-devkit/core';
import { Rule, Tree } from '@angular-devkit/schematics';
export type WorkspaceDefinition = workspaces.WorkspaceDefinition;
export type ProjectDefinition = workspaces.ProjectDefinition;
export type TargetDefinition = workspaces.TargetDefinition;
/**
 * A {@link workspaces.WorkspaceHost} backed by a Schematics {@link Tree} instance.
 */
export declare class TreeWorkspaceHost implements workspaces.WorkspaceHost {
    private readonly tree;
    constructor(tree: Tree);
    readFile(path: string): Promise<string>;
    writeFile(path: string, data: string): Promise<void>;
    isDirectory(path: string): Promise<boolean>;
    isFile(path: string): Promise<boolean>;
}
/**
 * Updates the workspace file (`angular.json`) found within the root of the schematic's tree.
 * The workspace object model can be directly modified within the provided updater function
 * with changes being written to the workspace file after the updater function returns.
 * The spacing and overall layout of the file (including comments) will be maintained where
 * possible when updating the file.
 *
 * @param updater An update function that can be used to modify the object model for the
 * workspace. A {@link WorkspaceDefinition} is provided as the first argument to the function.
 */
export declare function updateWorkspace(updater: (workspace: WorkspaceDefinition) => void | Rule | PromiseLike<void | Rule>): Rule;
/**
 * Reads a workspace file (`angular.json`) from the provided {@link Tree} instance.
 *
 * @param tree A schematics {@link Tree} instance used to access the workspace file.
 * @param path The path where a workspace file should be found. If a file is specified, the file
 * path will be used. If a directory is specified, the file `angular.json` will be used from
 * within the specified directory. Defaults to `/angular.json`.
 * @returns A {@link WorkspaceDefinition} representing the workspace found at the specified path.
 */
export declare function getWorkspace(tree: Tree, path?: string): Promise<WorkspaceDefinition>;
/**
 * Writes a workspace file (`angular.json`) to the provided {@link Tree} instance.
 * The spacing and overall layout of an exisitng file (including comments) will be maintained where
 * possible when writing the file.
 *
 * @param tree A schematics {@link Tree} instance used to access the workspace file.
 * @param workspace The {@link WorkspaceDefinition} to write.
 * @param path The path where a workspace file should be written. If a file is specified, the file
 * path will be used. If not provided, the definition's underlying file path stored during reading
 * will be used.
 */
export declare function writeWorkspace(tree: Tree, workspace: WorkspaceDefinition, path?: string): Promise<void>;
/**
 * Build a default project path for generating.
 * @param project The project which will have its default path generated.
 */
export declare function buildDefaultPath(project: workspaces.ProjectDefinition): string;
export declare function createDefaultPath(tree: Tree, projectName: string): Promise<string>;
export declare function allWorkspaceTargets(workspace: workspaces.WorkspaceDefinition): Iterable<[string, workspaces.TargetDefinition, string, workspaces.ProjectDefinition]>;
export declare function allTargetOptions(target: workspaces.TargetDefinition, skipBaseOptions?: boolean): Iterable<[string | undefined, Record<string, json.JsonValue | undefined>]>;
