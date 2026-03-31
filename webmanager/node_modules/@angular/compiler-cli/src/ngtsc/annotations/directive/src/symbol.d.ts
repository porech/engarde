/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import { SemanticSymbol, SemanticTypeParameter } from '../../../incremental/semantic_graph';
import { ClassPropertyMapping, DirectiveTypeCheckMeta, InputMapping } from '../../../metadata';
import { ClassDeclaration } from '../../../reflection';
/**
 * Represents an Angular directive. Components are represented by `ComponentSymbol`, which inherits
 * from this symbol.
 */
export declare class DirectiveSymbol extends SemanticSymbol {
    readonly selector: string | null;
    readonly inputs: ClassPropertyMapping<InputMapping>;
    readonly outputs: ClassPropertyMapping;
    readonly exportAs: string[] | null;
    readonly typeCheckMeta: DirectiveTypeCheckMeta;
    readonly typeParameters: SemanticTypeParameter[] | null;
    baseClass: SemanticSymbol | null;
    constructor(decl: ClassDeclaration, selector: string | null, inputs: ClassPropertyMapping<InputMapping>, outputs: ClassPropertyMapping, exportAs: string[] | null, typeCheckMeta: DirectiveTypeCheckMeta, typeParameters: SemanticTypeParameter[] | null);
    isPublicApiAffected(previousSymbol: SemanticSymbol): boolean;
    isTypeCheckApiAffected(previousSymbol: SemanticSymbol): boolean;
}
