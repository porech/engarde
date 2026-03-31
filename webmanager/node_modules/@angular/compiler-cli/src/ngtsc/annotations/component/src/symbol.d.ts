/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import { SemanticReference, SemanticSymbol } from '../../../incremental/semantic_graph';
import { DirectiveSymbol } from '../../directive';
/**
 * Represents an Angular component.
 */
export declare class ComponentSymbol extends DirectiveSymbol {
    usedDirectives: SemanticReference[];
    usedPipes: SemanticReference[];
    isRemotelyScoped: boolean;
    isEmitAffected(previousSymbol: SemanticSymbol, publicApiAffected: Set<SemanticSymbol>): boolean;
    isTypeCheckBlockAffected(previousSymbol: SemanticSymbol, typeCheckApiAffected: Set<SemanticSymbol>): boolean;
}
