/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import { ConstantPool, R3PartialDeclaration } from '@angular/compiler';
import { AstObject } from '../../ast/ast_value';
import { GetSourceFileFn } from '../get_source_file';
import { LinkedDefinition, PartialLinker } from './partial_linker';
import { AbsoluteFsPath } from '../../../../src/ngtsc/file_system/src/types';
/**
 * A `PartialLinker` that is designed to process `ɵɵngDeclareComponent()` call expressions.
 */
export declare class PartialComponentLinkerVersion1<TStatement, TExpression> implements PartialLinker<TExpression> {
    private readonly getSourceFile;
    private sourceUrl;
    private code;
    constructor(getSourceFile: GetSourceFileFn, sourceUrl: AbsoluteFsPath, code: string);
    linkPartialDeclaration(constantPool: ConstantPool, metaObj: AstObject<R3PartialDeclaration, TExpression>, version: string): LinkedDefinition;
    /**
     * This function derives the `R3ComponentMetadata` from the provided AST object.
     */
    private toR3ComponentMeta;
    /**
     * Update the range to remove the start and end chars, which should be quotes around the template.
     */
    private getTemplateInfo;
    private tryExternalTemplate;
    private templateFromPartialCode;
    private createR3ComponentDeferMetadata;
}
