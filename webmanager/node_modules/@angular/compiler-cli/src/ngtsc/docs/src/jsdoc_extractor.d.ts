/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import ts from 'typescript';
import { JsDocTagEntry } from './entities';
/** Gets the set of JsDoc tags applied to a node. */
export declare function extractJsDocTags(node: ts.HasJSDoc): JsDocTagEntry[];
/**
 * Gets the JsDoc description for a node. If the node does not have
 * a description, returns the empty string.
 */
export declare function extractJsDocDescription(node: ts.HasJSDoc): string;
/**
 * Gets the raw JsDoc applied to a node.
 * If the node does not have a JsDoc block, returns the empty string.
 */
export declare function extractRawJsDoc(node: ts.HasJSDoc): string;
