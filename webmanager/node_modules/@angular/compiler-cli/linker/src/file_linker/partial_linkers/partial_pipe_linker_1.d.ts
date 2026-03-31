/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import { ConstantPool, R3DeclarePipeMetadata, R3PartialDeclaration, R3PipeMetadata } from '@angular/compiler';
import { AstObject } from '../../ast/ast_value';
import { LinkedDefinition, PartialLinker } from './partial_linker';
/**
 * A `PartialLinker` that is designed to process `ɵɵngDeclarePipe()` call expressions.
 */
export declare class PartialPipeLinkerVersion1<TExpression> implements PartialLinker<TExpression> {
    constructor();
    linkPartialDeclaration(constantPool: ConstantPool, metaObj: AstObject<R3PartialDeclaration, TExpression>, version: string): LinkedDefinition;
}
/**
 * Derives the `R3PipeMetadata` structure from the AST object.
 */
export declare function toR3PipeMeta<TExpression>(metaObj: AstObject<R3DeclarePipeMetadata, TExpression>, version: string): R3PipeMetadata;
