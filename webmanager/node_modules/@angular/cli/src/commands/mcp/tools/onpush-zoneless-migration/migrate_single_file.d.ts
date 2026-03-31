/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import { RequestHandlerExtra } from '@modelcontextprotocol/sdk/shared/protocol';
import { ServerNotification, ServerRequest } from '@modelcontextprotocol/sdk/types';
import type { SourceFile } from 'typescript';
import { MigrationResponse } from './types';
export declare function migrateSingleFile(sourceFile: SourceFile, extras: RequestHandlerExtra<ServerRequest, ServerNotification>): Promise<MigrationResponse | null>;
