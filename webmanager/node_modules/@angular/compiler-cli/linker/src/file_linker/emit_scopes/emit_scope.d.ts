/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import { ConstantPool } from '@angular/compiler';
import { AstFactory } from '../../../../src/ngtsc/translator';
import { LinkedDefinition } from '../partial_linkers/partial_linker';
import { Translator } from '../translator';
/**
 * This class represents (from the point of view of the `FileLinker`) the scope in which
 * statements and expressions related to a linked partial declaration will be emitted.
 *
 * It holds a copy of a `ConstantPool` that is used to capture any constant statements that need to
 * be emitted in this context.
 *
 * This implementation will emit the definition and the constant statements separately.
 */
export declare class EmitScope<TStatement, TExpression> {
    protected readonly ngImport: TExpression;
    protected readonly translator: Translator<TStatement, TExpression>;
    private readonly factory;
    readonly constantPool: ConstantPool;
    constructor(ngImport: TExpression, translator: Translator<TStatement, TExpression>, factory: AstFactory<TStatement, TExpression>);
    /**
     * Translate the given Output AST definition expression into a generic `TExpression`.
     *
     * Use a `LinkerImportGenerator` to handle any imports in the definition.
     */
    translateDefinition(definition: LinkedDefinition): TExpression;
    /**
     * Return any constant statements that are shared between all uses of this `EmitScope`.
     */
    getConstantStatements(): TStatement[];
    private wrapInIifeWithStatements;
}
