/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import { Collection } from '@angular-devkit/schematics';
import { FileSystemCollectionDescription, FileSystemSchematicDescription, NodeWorkflow } from '@angular-devkit/schematics/tools';
import { Argv } from 'yargs';
import { CommandModule, CommandModuleImplementation, CommandScope, Options, OtherOptions } from './command-module';
import { Option } from './utilities/json-schema';
export declare const DEFAULT_SCHEMATICS_COLLECTION = "@schematics/angular";
export interface SchematicsCommandArgs {
    interactive: boolean;
    force: boolean;
    'dry-run': boolean;
    defaults: boolean;
}
export interface SchematicsExecutionOptions extends Options<SchematicsCommandArgs> {
    packageRegistry?: string;
}
export declare abstract class SchematicsCommandModule extends CommandModule<SchematicsCommandArgs> implements CommandModuleImplementation<SchematicsCommandArgs> {
    scope: CommandScope;
    protected readonly allowPrivateSchematics: boolean;
    builder(argv: Argv): Promise<Argv<SchematicsCommandArgs>>;
    /** Get schematic schema options.*/
    protected getSchematicOptions(collection: Collection<FileSystemCollectionDescription, FileSystemSchematicDescription>, schematicName: string, workflow: NodeWorkflow): Promise<Option[]>;
    protected getOrCreateWorkflowForBuilder(collectionName: string): NodeWorkflow;
    protected getOrCreateWorkflowForExecution(collectionName: string, options: SchematicsExecutionOptions): Promise<NodeWorkflow>;
    protected getSchematicCollections(): Promise<Set<string>>;
    protected parseSchematicInfo(schematic: string | undefined): [collectionName: string | undefined, schematicName: string | undefined];
    protected runSchematic(options: {
        executionOptions: SchematicsExecutionOptions;
        schematicOptions: OtherOptions;
        collectionName: string;
        schematicName: string;
    }): Promise<number>;
    private getProjectName;
    private getResolvePaths;
}
