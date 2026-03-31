/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import { MissingTargetChoice } from '../../command-builder/architect-base-command-module';
import { ArchitectCommandModule } from '../../command-builder/architect-command-module';
import { CommandModuleImplementation } from '../../command-builder/command-module';
export default class DeployCommandModule extends ArchitectCommandModule implements CommandModuleImplementation {
    missingTargetChoices: MissingTargetChoice[];
    multiTarget: boolean;
    command: string;
    longDescriptionPath: string;
    describe: string;
}
