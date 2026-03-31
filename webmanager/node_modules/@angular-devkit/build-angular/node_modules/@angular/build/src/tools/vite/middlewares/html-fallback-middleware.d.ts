/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import type { ServerResponse } from 'node:http';
import type { Connect } from 'vite';
export declare function angularHtmlFallbackMiddleware(req: Connect.IncomingMessage, _res: ServerResponse, next: Connect.NextFunction): void;
