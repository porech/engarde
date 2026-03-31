/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import { DeclarationNode } from '../../reflection';
export declare class ReferenceGraph<T = DeclarationNode> {
    private references;
    add(from: T, to: T): void;
    transitiveReferencesOf(target: T): Set<T>;
    pathFrom(source: T, target: T): T[] | null;
    private collectPathFrom;
    private collectTransitiveReferences;
}
