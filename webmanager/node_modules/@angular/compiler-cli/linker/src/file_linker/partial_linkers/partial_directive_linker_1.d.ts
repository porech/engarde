/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import { ConstantPool, ParseSourceSpan, R3DeclareDirectiveMetadata, R3DirectiveMetadata, R3PartialDeclaration } from '@angular/compiler';
import { Range } from '../../ast/ast_host';
import { AstObject } from '../../ast/ast_value';
import { LinkedDefinition, PartialLinker } from './partial_linker';
import { AbsoluteFsPath } from '../../../../src/ngtsc/file_system/src/types';
/**
 * A `PartialLinker` that is designed to process `ɵɵngDeclareDirective()` call expressions.
 */
export declare class PartialDirectiveLinkerVersion1<TExpression> implements PartialLinker<TExpression> {
    private sourceUrl;
    private code;
    constructor(sourceUrl: AbsoluteFsPath, code: string);
    linkPartialDeclaration(constantPool: ConstantPool, metaObj: AstObject<R3PartialDeclaration, TExpression>, version: string): LinkedDefinition;
}
/**
 * Derives the `R3DirectiveMetadata` structure from the AST object.
 */
export declare function toR3DirectiveMeta<TExpression>(metaObj: AstObject<R3DeclareDirectiveMetadata, TExpression>, code: string, sourceUrl: AbsoluteFsPath, version: string): R3DirectiveMetadata;
export declare function createSourceSpan(range: Range, code: string, sourceUrl: string): ParseSourceSpan;
