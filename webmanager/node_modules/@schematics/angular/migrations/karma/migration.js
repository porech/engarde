"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
const workspace_1 = require("../../utility/workspace");
const workspace_models_1 = require("../../utility/workspace-models");
const karma_config_analyzer_1 = require("./karma-config-analyzer");
const karma_config_comparer_1 = require("./karma-config-comparer");
function updateProjects(tree) {
    return (0, workspace_1.updateWorkspace)(async (workspace) => {
        const removableKarmaConfigs = new Map();
        for (const [projectName, project] of workspace.projects) {
            for (const [, target] of project.targets) {
                let needDevkitPlugin = false;
                switch (target.builder) {
                    case workspace_models_1.Builders.Karma:
                        needDevkitPlugin = true;
                        break;
                    case workspace_models_1.Builders.BuildKarma:
                        break;
                    default:
                        continue;
                }
                for (const [, options] of (0, workspace_1.allTargetOptions)(target, false)) {
                    const karmaConfig = options['karmaConfig'];
                    if (typeof karmaConfig !== 'string') {
                        continue;
                    }
                    let isRemovable = removableKarmaConfigs.get(karmaConfig);
                    if (isRemovable === undefined && tree.exists(karmaConfig)) {
                        const content = tree.readText(karmaConfig);
                        const analysis = (0, karma_config_analyzer_1.analyzeKarmaConfig)(content);
                        if (analysis.hasUnsupportedValues) {
                            // Cannot safely determine if the file is removable.
                            isRemovable = false;
                        }
                        else {
                            const diff = await (0, karma_config_comparer_1.compareKarmaConfigToDefault)(analysis, projectName, karmaConfig, needDevkitPlugin);
                            isRemovable = !(0, karma_config_comparer_1.hasDifferences)(diff) && diff.isReliable;
                        }
                        removableKarmaConfigs.set(karmaConfig, isRemovable);
                        if (isRemovable) {
                            tree.delete(karmaConfig);
                        }
                    }
                    if (isRemovable) {
                        delete options['karmaConfig'];
                    }
                }
            }
        }
    });
}
function default_1() {
    return updateProjects;
}
