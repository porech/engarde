/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import { Tree } from '@angular-devkit/schematics';
import { TargetDefinition, WorkspaceDefinition } from '../../utility/workspace';
/**
 * Searches the schematic tree for files that have a `.less` extension.
 * This is used to determine if the `less` package should be added as a dependency.
 *
 * @param tree A Schematics tree instance to search.
 * @returns `true` if Less stylesheet files are found; otherwise, `false`.
 */
export declare function hasLessStylesheets(tree: Tree): boolean;
/**
 * Searches for a PostCSS configuration file within the workspace root or any of the project roots.
 * This is used to determine if the `postcss` package should be added as a dependency.
 *
 * @param tree A Schematics tree instance to search.
 * @param workspace A Workspace to check for projects.
 * @returns `true` if a PostCSS configuration file is found; otherwise, `false`.
 */
export declare function hasPostcssConfiguration(tree: Tree, workspace: WorkspaceDefinition): boolean;
/**
 * The main orchestrator function for updating stylesheets.
 * It iterates through all stylesheets in a project, analyzes them, and applies the necessary
 * changes to the files and the build configuration.
 *
 * @param tree A Schematics tree instance.
 * @param projectSourceRoot The source root of the project being updated.
 * @param buildTarget The build target of the project being updated.
 */
export declare function updateStyleImports(tree: Tree, projectSourceRoot: string, buildTarget: TargetDefinition): void;
