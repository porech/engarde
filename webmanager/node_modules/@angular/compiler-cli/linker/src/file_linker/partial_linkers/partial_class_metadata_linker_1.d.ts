/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import { ConstantPool, R3ClassMetadata, R3DeclareClassMetadata, R3PartialDeclaration } from '@angular/compiler';
import { AstObject } from '../../ast/ast_value';
import { LinkedDefinition, PartialLinker } from './partial_linker';
/**
 * A `PartialLinker` that is designed to process `ɵɵngDeclareClassMetadata()` call expressions.
 */
export declare class PartialClassMetadataLinkerVersion1<TExpression> implements PartialLinker<TExpression> {
    linkPartialDeclaration(constantPool: ConstantPool, metaObj: AstObject<R3PartialDeclaration, TExpression>): LinkedDefinition;
}
/**
 * Derives the `R3ClassMetadata` structure from the AST object.
 */
export declare function toR3ClassMetadata<TExpression>(metaObj: AstObject<R3DeclareClassMetadata, TExpression>): R3ClassMetadata;
