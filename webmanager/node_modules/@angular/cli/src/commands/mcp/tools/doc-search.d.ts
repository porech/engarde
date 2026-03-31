/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import { z } from 'zod';
export declare const DOC_SEARCH_TOOL: import("./tool-registry").McpToolDeclaration<{
    query: z.ZodString;
    includeTopContent: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
}, {
    results: z.ZodArray<z.ZodObject<{
        title: z.ZodString;
        breadcrumb: z.ZodString;
        url: z.ZodString;
        content: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        title: string;
        breadcrumb: string;
        url: string;
        content?: string | undefined;
    }, {
        title: string;
        breadcrumb: string;
        url: string;
        content?: string | undefined;
    }>, "many">;
}>;
