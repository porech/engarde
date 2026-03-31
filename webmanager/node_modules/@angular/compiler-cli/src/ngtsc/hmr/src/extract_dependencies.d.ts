/*!
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import { R3CompiledExpression, R3ComponentDeferMetadata, R3HmrNamespaceDependency, outputAst as o } from '@angular/compiler';
import { DeclarationNode, ReflectionHost } from '../../reflection';
import { CompileResult } from '../../transform';
import { PartialEvaluator } from '../../partial_evaluator';
/**
 * Determines the file-level dependencies that the HMR initializer needs to capture and pass along.
 * @param sourceFile File in which the file is being compiled.
 * @param definition Compiled component definition.
 * @param factory Compiled component factory.
 * @param deferBlockMetadata Metadata about the defer blocks in the component.
 * @param classMetadata Compiled `setClassMetadata` expression, if any.
 * @param debugInfo Compiled `setClassDebugInfo` expression, if any.
 */
export declare function extractHmrDependencies(node: DeclarationNode, definition: R3CompiledExpression, factory: CompileResult, deferBlockMetadata: R3ComponentDeferMetadata, classMetadata: o.Statement | null, debugInfo: o.Statement | null, reflection: ReflectionHost, evaluator: PartialEvaluator): {
    local: {
        name: string;
        runtimeRepresentation: o.Expression;
    }[];
    external: R3HmrNamespaceDependency[];
} | null;
