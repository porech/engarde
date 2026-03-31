/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import { Tree } from '@angular-devkit/schematics';
import ts from '../../third_party/github.com/Microsoft/TypeScript/lib/typescript';
/** App config that was resolved to its source node. */
export interface ResolvedAppConfig {
    /** Tree-relative path of the file containing the app config. */
    filePath: string;
    /** Node defining the app config. */
    node: ts.ObjectLiteralExpression;
}
/**
 * Resolves the node that defines the app config from a bootstrap call.
 * @param bootstrapCall Call for which to resolve the config.
 * @param tree File tree of the project.
 * @param filePath File path of the bootstrap call.
 */
export declare function findAppConfig(bootstrapCall: ts.CallExpression, tree: Tree, filePath: string): ResolvedAppConfig | null;
