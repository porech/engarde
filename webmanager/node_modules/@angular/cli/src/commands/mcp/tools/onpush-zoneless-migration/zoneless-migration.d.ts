/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import { RequestHandlerExtra } from '@modelcontextprotocol/sdk/shared/protocol';
import { ServerNotification, ServerRequest } from '@modelcontextprotocol/sdk/types';
import { z } from 'zod';
export declare const ZONELESS_MIGRATION_TOOL: import("../tool-registry").McpToolDeclaration<{
    fileOrDirPath: z.ZodString;
}, z.ZodRawShape>;
export declare function registerZonelessMigrationTool(fileOrDirPath: string, extras: RequestHandlerExtra<ServerRequest, ServerNotification>): Promise<import("./types").MigrationResponse>;
