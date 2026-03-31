/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import { LinkedDefinition } from '../partial_linkers/partial_linker';
import { EmitScope } from './emit_scope';
/**
 * This class is a specialization of the `EmitScope` class that is designed for the situation where
 * there is no clear shared scope for constant statements. In this case they are bundled with the
 * translated definition and will be emitted into an IIFE.
 */
export declare class LocalEmitScope<TStatement, TExpression> extends EmitScope<TStatement, TExpression> {
    /**
     * Translate the given Output AST definition expression into a generic `TExpression`.
     *
     * Merges the `ConstantPool` statements with the definition statements when generating the
     * definition expression. This means that `ConstantPool` statements will be emitted into an IIFE.
     */
    translateDefinition(definition: LinkedDefinition): TExpression;
    /**
     * It is not valid to call this method, since there will be no shared constant statements - they
     * are already emitted in the IIFE alongside the translated definition.
     */
    getConstantStatements(): TStatement[];
}
