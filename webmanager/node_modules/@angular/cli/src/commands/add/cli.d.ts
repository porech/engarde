/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import { Argv } from 'yargs';
import { CommandModuleImplementation, Options, OtherOptions } from '../../command-builder/command-module';
import { SchematicsCommandArgs, SchematicsCommandModule } from '../../command-builder/schematics-command-module';
interface AddCommandArgs extends SchematicsCommandArgs {
    collection: string;
    verbose?: boolean;
    registry?: string;
    'skip-confirmation'?: boolean;
}
export default class AddCommandModule extends SchematicsCommandModule implements CommandModuleImplementation<AddCommandArgs> {
    command: string;
    describe: string;
    longDescriptionPath: string;
    protected allowPrivateSchematics: boolean;
    private readonly schematicName;
    private rootRequire;
    builder(argv: Argv): Promise<Argv<AddCommandArgs>>;
    run(options: Options<AddCommandArgs> & OtherOptions): Promise<number | void>;
    private isProjectVersionValid;
    private getCollectionName;
    private isPackageInstalled;
    private executeSchematic;
    private findProjectVersion;
    private hasMismatchedPeer;
}
export {};
