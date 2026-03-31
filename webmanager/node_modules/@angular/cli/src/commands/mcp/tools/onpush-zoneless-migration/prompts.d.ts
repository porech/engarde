/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import type { SourceFile } from 'typescript';
import { MigrationResponse } from './types';
export declare function createProvideZonelessForTestsSetupPrompt(testFilePath: string): MigrationResponse;
export declare function createUnsupportedZoneUsagesMessage(usages: string[], filePath: string): MigrationResponse;
export declare function generateZonelessMigrationInstructionsForComponent(filePath: string): MigrationResponse;
export declare function createTestDebuggingGuideForNonActionableInput(fileOrDirPath: string): MigrationResponse;
export declare function createFixResponseForZoneTests(sourceFile: SourceFile): Promise<MigrationResponse | null>;
export declare function createResponse(text: string): MigrationResponse;
