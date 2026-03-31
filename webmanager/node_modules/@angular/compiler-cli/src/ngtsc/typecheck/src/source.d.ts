/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import { AbsoluteSourceSpan, ParseSourceFile, ParseSourceSpan } from '@angular/compiler';
import ts from 'typescript';
import { TypeCheckId, SourceMapping } from '../api';
import { TypeCheckSourceResolver } from './tcb_util';
/**
 * Assigns IDs for type checking and keeps track of their origins.
 *
 * Implements `TypeCheckSourceResolver` to resolve the source of a template based on these IDs.
 */
export declare class DirectiveSourceManager implements TypeCheckSourceResolver {
    /**
     * This map keeps track of all template sources that have been type-checked by the id that is
     * attached to a TCB's function declaration as leading trivia. This enables translation of
     * diagnostics produced for TCB code to their source location in the template.
     */
    private templateSources;
    /** Keeps track of type check IDs and the source location of their host bindings. */
    private hostBindingSources;
    getTypeCheckId(node: ts.ClassDeclaration): TypeCheckId;
    captureTemplateSource(id: TypeCheckId, mapping: SourceMapping, file: ParseSourceFile): void;
    captureHostBindingsMapping(id: TypeCheckId, mapping: SourceMapping, file: ParseSourceFile): void;
    getTemplateSourceMapping(id: TypeCheckId): SourceMapping;
    getHostBindingsMapping(id: TypeCheckId): SourceMapping;
    toTemplateParseSourceSpan(id: TypeCheckId, span: AbsoluteSourceSpan): ParseSourceSpan | null;
    toHostParseSourceSpan(id: TypeCheckId, span: AbsoluteSourceSpan): ParseSourceSpan | null;
}
