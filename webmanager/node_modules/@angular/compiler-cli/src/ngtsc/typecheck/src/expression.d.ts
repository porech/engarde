/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import { AST } from '@angular/compiler';
import ts from 'typescript';
import { TypeCheckingConfig } from '../api';
/**
 * Gets an expression that is cast to any. Currently represented as `0 as any`.
 *
 * Historically this expression was using `null as any`, but a newly-added check in TypeScript 5.6
 * (https://devblogs.microsoft.com/typescript/announcing-typescript-5-6-beta/#disallowed-nullish-and-truthy-checks)
 * started flagging it as always being nullish. Other options that were considered:
 * - `NaN as any` or `Infinity as any` - not used, because they don't work if the `noLib` compiler
 *   option is enabled. Also they require more characters.
 * - Some flavor of function call, like `isNan(0) as any` - requires even more characters than the
 *   NaN option and has the same issue with `noLib`.
 */
export declare function getAnyExpression(): ts.AsExpression;
/**
 * Convert an `AST` to TypeScript code directly, without going through an intermediate `Expression`
 * AST.
 */
export declare function astToTypescript(ast: AST, maybeResolve: (ast: AST) => ts.Expression | null, config: TypeCheckingConfig): ts.Expression;
