/*!
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import { R3HmrMetadata, outputAst as o } from '@angular/compiler';
import { CompileResult } from '../../transform';
import { ClassDeclaration } from '../../reflection';
import ts from 'typescript';
/**
 * Gets the declaration for the function that replaces the metadata of a class during HMR.
 * @param compilationResults Code generated for the class during compilation.
 * @param meta HMR metadata about the class.
 * @param declaration Class for which the update declaration is being generated.
 */
export declare function getHmrUpdateDeclaration(compilationResults: CompileResult[], constantStatements: o.Statement[], meta: R3HmrMetadata, declaration: ClassDeclaration): ts.FunctionDeclaration;
