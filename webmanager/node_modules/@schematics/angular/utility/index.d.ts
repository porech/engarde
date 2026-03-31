/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
export { type ProjectDefinition, type TargetDefinition, type WorkspaceDefinition, getWorkspace as readWorkspace, updateWorkspace, writeWorkspace, } from './workspace';
export { Builders as AngularBuilder } from './workspace-models';
export * from './standalone';
export { DependencyType, ExistingBehavior, InstallBehavior, addDependency } from './dependency';
