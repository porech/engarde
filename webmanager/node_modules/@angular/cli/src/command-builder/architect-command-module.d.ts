/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import { Target } from '@angular-devkit/architect';
import { workspaces } from '@angular-devkit/core';
import { Argv } from 'yargs';
import { ArchitectBaseCommandModule } from './architect-base-command-module';
import { CommandModuleImplementation, Options, OtherOptions } from './command-module';
export interface ArchitectCommandArgs {
    configuration?: string;
    project?: string;
}
export declare abstract class ArchitectCommandModule extends ArchitectBaseCommandModule<ArchitectCommandArgs> implements CommandModuleImplementation<ArchitectCommandArgs> {
    abstract readonly multiTarget: boolean;
    findDefaultBuilderName?(project: workspaces.ProjectDefinition, target: Target): Promise<string | undefined>;
    builder(argv: Argv): Promise<Argv<ArchitectCommandArgs>>;
    run(options: Options<ArchitectCommandArgs> & OtherOptions): Promise<number | void>;
    private getArchitectProject;
    private getProjectNamesByTarget;
    /** @returns a sorted list of project names to be used for auto completion. */
    private getProjectChoices;
    /** @returns a sorted list of configuration names to be used for auto completion. */
    private getConfigurationChoices;
}
