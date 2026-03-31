/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import { Argv } from 'yargs';
import { CommandModule, CommandScope, Options } from '../../command-builder/command-module';
interface UpdateCommandArgs {
    packages?: string[];
    force: boolean;
    next: boolean;
    'migrate-only'?: boolean;
    name?: string;
    from?: string;
    to?: string;
    'allow-dirty': boolean;
    verbose: boolean;
    'create-commits': boolean;
}
export default class UpdateCommandModule extends CommandModule<UpdateCommandArgs> {
    scope: CommandScope;
    protected shouldReportAnalytics: boolean;
    private readonly resolvePaths;
    command: string;
    describe: string;
    longDescriptionPath: string;
    builder(localYargs: Argv): Argv<UpdateCommandArgs>;
    run(options: Options<UpdateCommandArgs>): Promise<number | void>;
    private executeSchematic;
    /**
     * @return Whether or not the migration was performed successfully.
     */
    private executeMigration;
    /**
     * @return Whether or not the migrations were performed successfully.
     */
    private executeMigrations;
    private executePackageMigrations;
    private migrateOnly;
    private updatePackagesAndMigrate;
    /**
     * @return Whether or not the commit was successful.
     */
    private commit;
    private checkCleanGit;
    /**
     * Checks if the current installed CLI version is older or newer than a compatible version.
     * @returns the version to install or null when there is no update to install.
     */
    private checkCLIVersion;
    private getCLIUpdateRunnerVersion;
    private runTempBinary;
    private packageManagerForce;
    private getOptionalMigrationsToRun;
}
export {};
