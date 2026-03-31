/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import { json, workspaces } from '@angular-devkit/core';
import { PackageManager } from '../../lib/config/workspace-schema';
import { JSONFile } from './json-file';
export declare const workspaceSchemaPath: string;
export declare class AngularWorkspace {
    private readonly workspace;
    readonly filePath: string;
    readonly basePath: string;
    constructor(workspace: workspaces.WorkspaceDefinition, filePath: string);
    get extensions(): Record<string, json.JsonValue | undefined>;
    get projects(): workspaces.ProjectDefinitionCollection;
    getCli(): Record<string, any> | undefined;
    getProjectCli(projectName: string): Record<string, any> | undefined;
    save(): Promise<void>;
    static load(workspaceFilePath: string): Promise<AngularWorkspace>;
}
export declare function getWorkspace(level: 'global'): Promise<AngularWorkspace>;
export declare function getWorkspace(level: 'local'): Promise<AngularWorkspace | undefined>;
export declare function getWorkspace(level: 'local' | 'global'): Promise<AngularWorkspace | undefined>;
/**
 * This method will load the workspace configuration in raw JSON format.
 * When `level` is `global` and file doesn't exists, it will be created.
 *
 * NB: This method is intended to be used only for `ng config`.
 */
export declare function getWorkspaceRaw(level?: 'local' | 'global'): Promise<[JSONFile | null, string | null]>;
export declare function validateWorkspace(data: json.JsonObject, isGlobal: boolean): Promise<void>;
export declare function getProjectByCwd(workspace: AngularWorkspace): string | null;
export declare function getConfiguredPackageManager(): Promise<PackageManager | null>;
export declare function getSchematicDefaults(collection: string, schematic: string, project?: string | null): Promise<{}>;
export declare function isWarningEnabled(warning: string): Promise<boolean>;
