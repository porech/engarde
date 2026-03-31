"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.TreeWorkspaceHost = void 0;
exports.updateWorkspace = updateWorkspace;
exports.getWorkspace = getWorkspace;
exports.writeWorkspace = writeWorkspace;
exports.buildDefaultPath = buildDefaultPath;
exports.createDefaultPath = createDefaultPath;
exports.allWorkspaceTargets = allWorkspaceTargets;
exports.allTargetOptions = allTargetOptions;
const core_1 = require("@angular-devkit/core");
const schematics_1 = require("@angular-devkit/schematics");
const workspace_models_1 = require("./workspace-models");
const DEFAULT_WORKSPACE_PATH = '/angular.json';
/**
 * A {@link workspaces.WorkspaceHost} backed by a Schematics {@link Tree} instance.
 */
class TreeWorkspaceHost {
    tree;
    constructor(tree) {
        this.tree = tree;
    }
    async readFile(path) {
        return this.tree.readText(path);
    }
    async writeFile(path, data) {
        if (this.tree.exists(path)) {
            this.tree.overwrite(path, data);
        }
        else {
            this.tree.create(path, data);
        }
    }
    async isDirectory(path) {
        // approximate a directory check
        return !this.tree.exists(path) && this.tree.getDir(path).subfiles.length > 0;
    }
    async isFile(path) {
        return this.tree.exists(path);
    }
}
exports.TreeWorkspaceHost = TreeWorkspaceHost;
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
function updateWorkspace(updater) {
    return async (host) => {
        const workspace = await getWorkspace(host);
        const result = await updater(workspace);
        await core_1.workspaces.writeWorkspace(workspace, new TreeWorkspaceHost(host));
        return result || schematics_1.noop;
    };
}
// TODO: This should be renamed `readWorkspace` once deep imports are restricted (already exported from `utility` with that name)
/**
 * Reads a workspace file (`angular.json`) from the provided {@link Tree} instance.
 *
 * @param tree A schematics {@link Tree} instance used to access the workspace file.
 * @param path The path where a workspace file should be found. If a file is specified, the file
 * path will be used. If a directory is specified, the file `angular.json` will be used from
 * within the specified directory. Defaults to `/angular.json`.
 * @returns A {@link WorkspaceDefinition} representing the workspace found at the specified path.
 */
async function getWorkspace(tree, path = DEFAULT_WORKSPACE_PATH) {
    const host = new TreeWorkspaceHost(tree);
    const { workspace } = await core_1.workspaces.readWorkspace(path, host);
    return workspace;
}
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
async function writeWorkspace(tree, workspace, path) {
    const host = new TreeWorkspaceHost(tree);
    return core_1.workspaces.writeWorkspace(workspace, host, path);
}
/**
 * Build a default project path for generating.
 * @param project The project which will have its default path generated.
 */
function buildDefaultPath(project) {
    const root = project.sourceRoot ? `/${project.sourceRoot}/` : `/${project.root}/src/`;
    const projectDirName = project.extensions['projectType'] === workspace_models_1.ProjectType.Application ? 'app' : 'lib';
    return `${root}${projectDirName}`;
}
async function createDefaultPath(tree, projectName) {
    const workspace = await getWorkspace(tree);
    const project = workspace.projects.get(projectName);
    if (!project) {
        throw new Error(`Project "${projectName}" does not exist.`);
    }
    return buildDefaultPath(project);
}
function* allWorkspaceTargets(workspace) {
    for (const [projectName, project] of workspace.projects) {
        for (const [targetName, target] of project.targets) {
            yield [targetName, target, projectName, project];
        }
    }
}
function* allTargetOptions(target, skipBaseOptions = false) {
    if (!skipBaseOptions && target.options) {
        yield [undefined, target.options];
    }
    if (!target.configurations) {
        return;
    }
    for (const [name, options] of Object.entries(target.configurations)) {
        if (options !== undefined) {
            yield [name, options];
        }
    }
}
