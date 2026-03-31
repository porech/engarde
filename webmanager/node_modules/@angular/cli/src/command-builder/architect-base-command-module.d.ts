/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import { Architect, Target } from '@angular-devkit/architect';
import { WorkspaceNodeModulesArchitectHost } from '@angular-devkit/architect/node';
import { CommandModule, CommandModuleImplementation, CommandScope, OtherOptions } from './command-module';
import { Option } from './utilities/json-schema';
export interface MissingTargetChoice {
    name: string;
    value: string;
}
export declare abstract class ArchitectBaseCommandModule<T extends object> extends CommandModule<T> implements CommandModuleImplementation<T> {
    scope: CommandScope;
    protected readonly missingTargetChoices: MissingTargetChoice[] | undefined;
    protected runSingleTarget(target: Target, options: OtherOptions): Promise<number>;
    private builderStatsToAnalyticsParameters;
    private _architectHost;
    protected getArchitectHost(): WorkspaceNodeModulesArchitectHost;
    private _architect;
    protected getArchitect(skipUndefinedArrayTransform: boolean): Architect;
    protected getArchitectTargetOptions(target: Target): Promise<Option[]>;
    private warnOnMissingNodeModules;
    protected getArchitectTarget(): string;
    protected onMissingTarget(defaultMessage: string): Promise<1>;
    private getMissingTargetPackageToInstall;
}
