/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import { ConstantPool, R3DeclareNgModuleMetadata, R3NgModuleMetadata, R3PartialDeclaration } from '@angular/compiler';
import { AstObject } from '../../ast/ast_value';
import { LinkedDefinition, PartialLinker } from './partial_linker';
/**
 * A `PartialLinker` that is designed to process `ɵɵngDeclareNgModule()` call expressions.
 */
export declare class PartialNgModuleLinkerVersion1<TExpression> implements PartialLinker<TExpression> {
    /**
     * If true then emit the additional declarations, imports, exports, etc in the NgModule
     * definition. These are only used by JIT compilation.
     */
    private emitInline;
    constructor(
    /**
     * If true then emit the additional declarations, imports, exports, etc in the NgModule
     * definition. These are only used by JIT compilation.
     */
    emitInline: boolean);
    linkPartialDeclaration(constantPool: ConstantPool, metaObj: AstObject<R3PartialDeclaration, TExpression>): LinkedDefinition;
}
/**
 * Derives the `R3NgModuleMetadata` structure from the AST object.
 */
export declare function toR3NgModuleMeta<TExpression>(metaObj: AstObject<R3DeclareNgModuleMetadata, TExpression>, supportJit: boolean): R3NgModuleMetadata;
