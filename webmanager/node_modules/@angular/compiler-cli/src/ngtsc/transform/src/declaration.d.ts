/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import { Type } from '@angular/compiler';
import ts from 'typescript';
import { ImportRewriter, ReferenceEmitter } from '../../imports';
import { ClassDeclaration, ReflectionHost } from '../../reflection';
import { ImportManager } from '../../translator';
import { DtsTransform } from './api';
/**
 * Keeps track of `DtsTransform`s per source file, so that it is known which source files need to
 * have their declaration file transformed.
 */
export declare class DtsTransformRegistry {
    private ivyDeclarationTransforms;
    getIvyDeclarationTransform(sf: ts.SourceFile): IvyDeclarationDtsTransform;
    /**
     * Gets the dts transforms to be applied for the given source file, or `null` if no transform is
     * necessary.
     */
    getAllTransforms(sf: ts.SourceFile): DtsTransform[] | null;
}
export declare function declarationTransformFactory(transformRegistry: DtsTransformRegistry, reflector: ReflectionHost, refEmitter: ReferenceEmitter, importRewriter: ImportRewriter): ts.TransformerFactory<ts.SourceFile>;
export interface IvyDeclarationField {
    name: string;
    type: Type;
}
export declare class IvyDeclarationDtsTransform implements DtsTransform {
    private declarationFields;
    addFields(decl: ClassDeclaration, fields: IvyDeclarationField[]): void;
    transformClass(clazz: ts.ClassDeclaration, members: ReadonlyArray<ts.ClassElement>, reflector: ReflectionHost, refEmitter: ReferenceEmitter, imports: ImportManager): ts.ClassDeclaration;
}
