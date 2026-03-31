/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import { ConstantPool, R3DeclareFactoryMetadata, R3FactoryMetadata, R3PartialDeclaration } from '@angular/compiler';
import { AstObject } from '../../ast/ast_value';
import { LinkedDefinition, PartialLinker } from './partial_linker';
/**
 * A `PartialLinker` that is designed to process `ɵɵngDeclareFactory()` call expressions.
 */
export declare class PartialFactoryLinkerVersion1<TExpression> implements PartialLinker<TExpression> {
    linkPartialDeclaration(constantPool: ConstantPool, metaObj: AstObject<R3PartialDeclaration, TExpression>): LinkedDefinition;
}
/**
 * Derives the `R3FactoryMetadata` structure from the AST object.
 */
export declare function toR3FactoryMeta<TExpression>(metaObj: AstObject<R3DeclareFactoryMetadata, TExpression>): R3FactoryMetadata;
